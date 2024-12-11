import { ConstantRequestField } from "../../utils/constants";
import { isSuccessfulCodeResponse, postRequest } from "../../utils/https";
import { ApiErrorType, RequestKey } from "../utils/constants";
import {
  InitializeMtnMomoPaymentRequest,
  InitializeMtnMomoResponse,
  MtnMomoPaymentParams,
} from "../utils/request_model";

/**
 * Initializes an MTN MOMO payment transaction by validating the provided parameters
 * and invoking the internal payment initialization function.
 *
 * @param {Object} params - The parameters for initializing the payment.
 * @param {InitializeMtnMomoPaymentRequest} params.mobileInitParams - The request details for the payment.
 * @param {MtnMomoPaymentParams} params.paymentConfig - Configuration parameters for the payment.
 * @param {string} params.endPoint - The API endpoint for the payment request.
 * @param {string} params.accessToken - The access token for authorization.
 * @returns {Promise<InitializeMtnMomoResponse>} - The response from the payment initialization process.
 *
 * Logs a warning and returns an error response if any required parameter is missing.
 */
export async function initializeMtnMomoPayment({
  mobileInitParams,
  paymentConfig,
  endPoint,
  accessToken,
}: {
  mobileInitParams: InitializeMtnMomoPaymentRequest;
  paymentConfig: MtnMomoPaymentParams;
  endPoint: string;
  accessToken: string;
}): Promise<InitializeMtnMomoResponse> {
  const logger = paymentConfig.logger;
  const ocpApimSubscription = paymentConfig.ocpApimSubscriptionKey;
  const amount = mobileInitParams.amount;
  const xReferenceId = mobileInitParams.xReferenceId;
  const userNumber = mobileInitParams.userPhoneNumber;
  const xTargetEnvironment = paymentConfig.xTargetEnvironment;
  const currency = mobileInitParams.currency;
  const apiKey = paymentConfig.apiKey;
  const apiUser = paymentConfig.apiUserKey;
  const externalId = mobileInitParams.externalId;

  if (
    !(
      ocpApimSubscription &&
      amount &&
      xReferenceId &&
      userNumber &&
      xTargetEnvironment &&
      currency &&
      apiKey &&
      apiUser &&
      externalId
    )
  ) {
    logger.warn(
      "[MTN MOMO] Initialization failed with error: Invalid data provided. ",
      JSON.stringify(mobileInitParams)
    );
    return {
      error: ApiErrorType.invalidData,
      raw: mobileInitParams,
    };
  }

  const paymentParams = {
    mobileInitParams: mobileInitParams,
    paymentConfig: paymentConfig,
    endPoint: endPoint,
    accessToken: accessToken,
  };

  return initializeMtnMomoPaymentInternal(paymentParams);
}

/**
 * Initializes an MTN MOMO payment transaction.
 *
 * @param params - The parameters required to initiate the payment, including:
 *   - mobileInitParams: The request details for the payment initialization.
 *   - paymentConfig: Configuration parameters for the payment process.
 *   - endPoint: The API endpoint for the payment request.
 *   - accessToken: The access token for authorization.
 *
 * @returns A promise that resolves to an InitializeMtnMomoResponse object,
 * indicating the result of the payment initialization.
 *
 * Logs the initiation process and handles errors by returning appropriate
 * error types if the payment initiation fails.
 */
const initializeMtnMomoPaymentInternal = async (params: {
  mobileInitParams: InitializeMtnMomoPaymentRequest;
  paymentConfig: MtnMomoPaymentParams;
  endPoint: string;
  accessToken: string;
}): Promise<InitializeMtnMomoResponse> => {
  const headers: Record<string, string> = {
    [RequestKey.keyAuthorization]: `${ConstantRequestField.bearer} ${params.accessToken}`,
    [RequestKey.keySubscriptionKey]:
      params.paymentConfig.ocpApimSubscriptionKey,
    [RequestKey.keyXReferenceId]: params.mobileInitParams.xReferenceId,
    [RequestKey.keyEnvironmentTarget]: params.paymentConfig.xTargetEnvironment,
    [RequestKey.keyContentType]: ConstantRequestField.typeJson,
  };
  if (params.mobileInitParams.xCallbackUrl) {
    headers[RequestKey.keyXCallbackUrl] = params.mobileInitParams.xCallbackUrl;
  }
  const paymentBody = {
    [RequestKey.keyPayerMessage]: params.mobileInitParams.payerMessage ?? "",
    [RequestKey.keyPayeeNote]: params.mobileInitParams.payeeNote ?? "",
    [RequestKey.keyExternalId]: params.mobileInitParams.externalId,
    [RequestKey.keyAmount]: params.mobileInitParams.amount,
    [RequestKey.keyCurrency]: params.mobileInitParams.currency,
    [RequestKey.keyPayer]: {
      [RequestKey.keyPartyIdType]: "MSISDN",
      [RequestKey.keyPartyId]: params.mobileInitParams.userPhoneNumber,
    },
  };

  params.paymentConfig.logger.info(
    `Initiate the Mtn MOMO Payment with data: ${JSON.stringify(
      paymentBody
    )}\nroute: ${params.endPoint}`
  );

  const response = await postRequest({
    logger: params.paymentConfig.logger,
    headers: headers,
    data: paymentBody,
    route: params.endPoint,
  });
  const responseData = response?.response;

  if (!responseData) {
    params.paymentConfig.logger.warn(
      `Failed to initiate the MTN MOMO payment from payer number ${
        params.mobileInitParams.userPhoneNumber
      }. Request Body: ${JSON.stringify(paymentBody)}`
    );
    return {
      raw: response.error,
      error: ApiErrorType.failedToInitiateThePayment,
    };
  }

  if (!isSuccessfulCodeResponse(responseData.status)) {
    params.paymentConfig.logger.warn(
      `Failed to initiate the MTN MOMO payment from payer number ${params.mobileInitParams.userPhoneNumber}. Request status ${responseData?.status} and data: ${responseData?.data}`
    );
    return {
      raw: responseData,
      error: response.error,
    };
  }

  return {
    data: {
      status: 202,
    },
    raw: responseData,
  };
};
