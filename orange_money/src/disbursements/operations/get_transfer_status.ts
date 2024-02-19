import Joi from 'joi';
import { getRequest } from '../../common/utils/https';
import { OperationResponse } from '../../common/utils/operation_response';
import {
  DisbursementServiceConfig,
  DisbursementServiceConfigSchema,
} from '../implementations/disbursement_service';
import { DisbursementApiRawStatus, DisbursementStatus } from '../utils/status';
import { getStatusFromProviderRawStatus } from '../utils/utils';
export interface GetTransferStatusRequest {
  token: string;
  messageId: string;
}

const GetTransferStatusRequestSchema = Joi.object<GetTransferStatusRequest>({
  token: Joi.string().required(),
  messageId: Joi.string().required(),
}).required();

type GetTransferStatusResponseRawData =
  | {
      result: {
        message: string;
        data: {
          createtime: string;
          subscriberMsisdn: string;
          amount: number;
          payToken: string;
          txnid: string;
          txnmode: string;
          txnstatus: string;
          orderId: string;
          status: DisbursementApiRawStatus;
          channelUserMsisdn: string;
          description: string;
        };
      };
      parameters?: {
        amount: string;
        xauth: string;
        channel_user_msisdn: string;
        customer_key: string;
        customer_secret: string | null;
        final_customer_name: string;
        final_customer_phone: string;
      };
      CreateAt: string;
      MessageId: string;
      RefundStep: DisbursementStep;
    }
  | {
      parameters?: {
        amount: string;
        xauth: string;
        channel_user_msisdn: string;
        customer_key: string;
        customer_secret: string | null;
        final_customer_name: string;
        final_customer_phone: string;
      };
      message: string;
      RefundStep: DisbursementStep;
    }
  | {
      ErrorCode: number;
      body: string;
      ErrorMessage: string;
      parameters?: {
        amount: string;
        xauth: string;
        channel_user_msisdn: string;
        customer_key: string;
        customer_secret: string | null;
        final_customer_name: string;
        final_customer_phone: string;
      };
      CreateAt: string;
      MessageId: string;
      RefundStep: DisbursementStep;
    }
  | {
      result: {
        createtime: string;
        toChannelMsisdn: string;
        amount: 498925;
        payToken: string;
        txnid: string;
        txnmode: string;
        txnmessage: string;
        txnstatus: string;
        orderId: string;
        status: DisbursementApiRawStatus;
        fromChannelMsisdn: string;
        description: string;
      };
      parameters: {
        amount: string;
        xauth: string;
        channel_user_msisdn: string;
        customer_key: string;
        customer_secret: string | null;
        final_customer_name: string;
        final_customer_phone: string;
      };
      CreateAt: string;
      RefundStep: DisbursementStep;
    }
  | string;

export enum DisbursementStep {
  TransferSent = '2',
  InitializingTransfer = '1',
}

export interface responseData {
  status?: DisbursementStatus;
  refundStep?: DisbursementStep;
}

export type GetTransferStatusResponse = OperationResponse<
  responseData,
  GetTransferStatusResponseRawData
>;

/**
 * Retrieves the transfer status of a transaction.
 *
 * @param {DisbursementServiceConfig} configs - The disbursement service config.
 * @param {GetTransferStatusRequest} params - The parameters for retrieving the transfer status.
 * @return {GetTransferStatusResponse} - The method response containing the transfer status.
 */
export async function getTransferStatus({
  configs,
  params,
  endPoint,
}: {
  configs: DisbursementServiceConfig;
  params: GetTransferStatusRequest;
  endPoint: string;
}): GetTransferStatusResponse {
  const logger = configs.logger;
  logger.info(
    `getTransferStatus is running with params : ${JSON.stringify(params)}`
  );

  const { error: configsValidationError, value: configsValues } =
    DisbursementServiceConfigSchema.validate(configs);

  if (configsValidationError) {
    logger.error(
      `Invalid DisbursementServiceConfig request parameters. params : ${JSON.stringify(
        configsValidationError.details
      )}`
    );
    return { error: configsValidationError.details };
  }

  const { error: paramsValidationError, value: paramsValue } =
    GetTransferStatusRequestSchema.validate(params);

  if (paramsValidationError) {
    logger.error(
      `Invalid getTransferStatus request parameters. params : ${JSON.stringify(
        paramsValidationError
      )}`
    );
    return { error: paramsValidationError };
  }

  const headers = {
    Authorization: `Bearer ${paramsValue.token}`,
  };

  const body = {
    customerkey: configsValues.customerKey,
    customersecret: configsValues.customerSecret,
  };

  const response = await getRequest<GetTransferStatusResponseRawData>({
    logger: configsValues.logger,
    route: endPoint,
    headers: headers,
    data: body,
    rejectUnauthorized: false,
  });

  if (!response.response) {
    return { error: response.error };
  }

  const data = response.response.data;

  if (typeof data === 'string') {
    // Handle string response.
    return { error: data };
  } else if ('result' in data) {
    // Remove the customer secret from the raw data, because
    // it is a very sensitive secret.
    if (data.parameters) {
      data.parameters.customer_secret = null;
    }
    const rawStatus: DisbursementApiRawStatus =
      'status' in data.result ? data.result.status : data.result.data.status;
    const status = getStatusFromProviderRawStatus(rawStatus);

    if (data.RefundStep === DisbursementStep.InitializingTransfer) {
      return {
        data: {
          status:
            status === DisbursementStatus.succeeded
              ? DisbursementStatus.pending
              : status,
          refundStep: data.RefundStep,
        },
        raw: data,
      };
    }

    return {
      data: {
        status: status,
        refundStep: data.RefundStep,
      },
      raw: data,
    };
  } else if ('ErrorCode' in data) {
    if (data.parameters) {
      data.parameters.customer_secret = null;
    }
    if (data.ErrorCode === 5019) {
      return {
        data: {
          status: DisbursementStatus.failed,
          refundStep: data.RefundStep,
        },
        raw: data,
      };
    }
    configsValues.logger.error(
      `Unexpected ErrorCode : ${JSON.stringify(data)}`
    );

    return {
      data: {
        status: DisbursementStatus.pending,
        refundStep: data.RefundStep,
      },
      raw: data,
    };
  } else if (data.RefundStep === DisbursementStep.InitializingTransfer) {
    if (data.parameters) {
      data.parameters.customer_secret = null;
    }
    return {
      data: {
        status: DisbursementStatus.pending,
        refundStep: data.RefundStep,
      },
      raw: data,
    };
  }

  // By default, assume we failed to retrieve the disbursement status.
  return { error: data };
}
