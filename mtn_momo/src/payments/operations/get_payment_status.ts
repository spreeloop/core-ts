import { ConstantRequestField } from "../../utils/constants";
import { getRequest, isSuccessfulCodeResponse } from "../../utils/https";
import {
  ApiErrorType,
  MtnMomoFailedPaymentReason,
  MtnMomoPaymentStatus,
  RequestKey,
} from "../utils/constants";

import {
  GetMtnMomoPaymentRequest,
  GetMtnMomoPaymentResponse,
  GetStatusRequestResponseDataFromMtn,
  MtnMomoPaymentConfigs,
} from "../utils/request_model";

/**
 * Retrieves the payment status for an MTN MOMO transaction.
 *
 * @param mobileStatusVerificationParams - Parameters containing the reference ID for the payment request.
 * @param paymentServiceConfig - Configuration parameters for the payment service, including API keys and environment settings.
 * @param endPoint - The API endpoint to check the payment status.
 * @param accessToken - Optional access token for authorization.
 * @returns A promise that resolves to the payment status response, including status data or an error type.
 */
export async function getPaymentStatus({
  mobileStatusVerificationParams,
  paymentServiceConfig,
  endPoint,
  accessToken,
}: {
  mobileStatusVerificationParams: GetMtnMomoPaymentRequest;
  paymentServiceConfig: MtnMomoPaymentConfigs;
  endPoint: string;
  accessToken: string;
}): Promise<GetMtnMomoPaymentResponse> {
  const logger = paymentServiceConfig.logger;

  const ocpApimSubscription = paymentServiceConfig.ocpApimSubscriptionKey;
  const xReferenceId = mobileStatusVerificationParams.referenceId;
  const apiUser = paymentServiceConfig.apiUserKey;
  const apiKey = paymentServiceConfig.apiKey;
  const xTargetEnvironment = paymentServiceConfig.xTargetEnvironment;

  logger.info(
    `[Mtn MOMO] Checks the Mtn MOMO Payment status with route: ${endPoint}`
  );

  if (
    !(
      ocpApimSubscription &&
      xReferenceId &&
      xTargetEnvironment &&
      apiKey &&
      apiUser
    )
  ) {
    logger.warn(
      "Status check failed. Invalid data provided.",
      JSON.stringify({
        ocpApimSubscription,
        xReferenceId,
        xTargetEnvironment,
        apiKey,
        apiUser,
      })
    );
    return {
      error: ApiErrorType.invalidData,
      raw: {
        error: "Status check failed. Invalid data provided.",
        status: 400,
      },
    };
  }

  const paymentHeader = {
    [RequestKey.keyAuthorization]: `${ConstantRequestField.bearer} ${accessToken}`,
    [RequestKey.keySubscriptionKey]: ocpApimSubscription,
    [RequestKey.keyEnvironmentTarget]: xTargetEnvironment,
  };

  const response = await getRequest<GetStatusRequestResponseDataFromMtn>({
    headers: paymentHeader,
    route: endPoint,
    logger: logger,
  });
  const responseData = response?.response;
  const status = responseData?.data?.status;

  if (responseData && isSuccessfulCodeResponse(responseData.status) && status) {
    logger.log(
      `[Mtn MOMO] Status verification successful with result ${JSON.stringify(
        responseData.data
      )}`
    );
    return {
      data: {
        status: status as MtnMomoPaymentStatus,
        reason: responseData.data.reason as
          | MtnMomoFailedPaymentReason
          | undefined,
      },
      raw: responseData.data,
    };
  }

  logger.warn(
    `[Mtn MOMO] Status verification failed with error data: ${JSON.stringify(
      response.error
    )}`
  );
  return {
    raw: response.error,
    error: ApiErrorType.failedToCheckPaymentStatus,
  };
}
