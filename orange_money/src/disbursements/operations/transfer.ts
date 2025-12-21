import Joi from 'joi';
import { RequestResponse, postRequest } from '../../utils/https';
import { OperationResponse } from '../../utils/operation_response';
import {
  DisbursementServiceConfig,
  DisbursementServiceConfigSchema,
} from '../implementations/disbursement_service';
import { orangeMoneyPhoneNumberWithoutCountryCodeRegex } from '../utils/regex';

export enum TransferMethod {
  OrangeMoney = 'OrangeMoney',
  Deposit = 'Deposit',
}

export enum DebitPolicyMethod {
  DepositAccOnly = 'deposit_acc_only',
}

export interface TransferRequest {
  webhook: string;
  amount: number;
  customerPhone: string;
  customerName: string;
  feesIncluded?: 'Yes' | 'No' | null;
  finalCustomerNameAccuracy?: number | null;
  refundMethod?: TransferMethod | null;
  token: string;
}

export const TransferRequestSchema = Joi.object<TransferRequest>({
  webhook: Joi.string().uri().required(),
  amount: Joi.number().integer().min(1).required(),
  customerPhone: Joi.string()
    .pattern(orangeMoneyPhoneNumberWithoutCountryCodeRegex)
    .required(),
  customerName: Joi.string().required(),
  feesIncluded: Joi.string().allow(null),
  finalCustomerNameAccuracy: Joi.number().integer().min(0).max(100).allow(null),
  refundMethod: Joi.string().allow(null),
  token: Joi.string().required(),
});

export type TransferResponseRawData = {
  MD5OfMessageBody: string;
  MD5OfMessageAttributes: string;
  MessageId: string;
  error?: string;
  StatusCode?: number;
  ResponseMetadata: {
    RequestId: string;
    HTTPStatusCode: number;
    HTTPHeaders: {
      'x-amzn-requestid': string;
      'x-amzn-trace-id': string;
      date: string;
      'content-type': string;
      'content-length': string;
    };
    RetryAttempts: number;
  };
};

export type TransferResponse = OperationResponse<
  string,
  TransferResponseRawData
>;

/**
 * Transfers the specified amount of currency to the specified party.
 *
 * @param {DisbursementServiceConfig} configs - The disbursement service config.
 * @param {TransferRequest} params - The transfer parameters.
 * @return {MethodResponse<string, TransferRawData>} - The method response.
 */
export async function transfer({
  configs,
  params,
  endPoint,
}: {
  configs: DisbursementServiceConfig;
  params: TransferRequest;
  endPoint: string;
}): TransferResponse {
  const logger = configs.logger;
  logger.info(`transfer is running with params : ${JSON.stringify(params)}`);

  const { error: configsValidationError, value: configValues } =
    DisbursementServiceConfigSchema.validate(configs);

  if (configsValidationError) {
    logger.error(
      `Invalid DisbursementServiceConfig request parameters. params : ${JSON.stringify(
        configsValidationError.details
      )}`
    );
    return { error: configsValidationError.details };
  }

  const { error: paramsValidationError, value: paramsValues } =
    TransferRequestSchema.validate(params);
  if (paramsValidationError) {
    return {
      error: `Invalid transfer request parameters. params : ${JSON.stringify(
        params
      )}`,
    };
  }
  const header = {
    Authorization: `Bearer ${paramsValues.token}`,
  };
  const body: Record<string, string> = {
    customerkey: configValues.customerKey,
    customersecret: configValues.customerSecret,
    channelUserMsisdn: configValues.channelUserMsisdn,
    pin: configValues.pin,
    webhook: paramsValues.webhook,
    amount: `${paramsValues.amount}`,
    final_customer_phone: paramsValues.customerPhone,
    final_customer_name: paramsValues.customerName,
    refund_method: TransferMethod.OrangeMoney,
    fees_included: paramsValues.feesIncluded ?? 'No',
  };

  if (paramsValues.finalCustomerNameAccuracy) {
    body.final_customer_name_accuracy =
      paramsValues.finalCustomerNameAccuracy.toString();
  }

  if (paramsValues.refundMethod === TransferMethod.Deposit) {
    body.debit_policy = DebitPolicyMethod.DepositAccOnly;
  }

  const response: RequestResponse<TransferResponseRawData> = await postRequest({
    logger: logger,
    route: endPoint,
    data: body,
    headers: header,
  });

  if (!response.response) {
    return { error: response.error };
  }

  if (
    response.response?.data.error ||
    response.response?.data.StatusCode === 503
  ) {
    logger.error(
      `Transfer failed with error: ${
        response.response.data.error || 'Service unavailable'
      }`
    );
    return { error: response.response.data.error || 'Service unavailable' };
  }

  return {
    data: response.response.data.MessageId,
    raw: response.response.data,
  };
}
