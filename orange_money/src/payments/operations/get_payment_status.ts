import { getRequest, isSuccessfulCodeResponse } from '../../utils/https';
import { ApiErrorType, ApiKey, ConstantRequestField } from '../utils/constants';
import {
  GenericRequestResponseData,
  OrangeMoneyPaymentParams,
} from '../utils/joi_schema';
import {
  GetOrangeMoneyPaymentRequest,
  GetOrangeMoneyPaymentResponse,
} from '../utils/request_model';

/**
 * Gets the mobile payment status.
 *
 * @param {Object} options - The options object.
 * @param {GetOrangeMoneyPaymentRequest} options.mobileStatusVerificationParams - The parameters for mobile status verification.
 * @param {string} endPoint - The init payment end point.
 * @param {OrangeMoneyPaymentParams} paymentServiceConfig - The mobile payment config parameters.
 *    - {TargetEnvironment} PaymentServiceConfig.targetEnvironment - The target environment.
 *    - {string} PaymentServiceConfig.apiUserName - The api user name.
 *    - {string} PaymentServiceConfig.xAuthToken - The x-auth-token.
 *    - {string} PaymentServiceConfig.apiPassword - The api password.
 *    - {string} [PaymentServiceConfig.orangeMoneyVersion] - The orange money version.
 *    - {LoggerInterface} PaymentServiceConfig.logger - The logger interface.
 * @return {Promise<GetOrangeMoneyPaymentResponse>} The promise that resolves to the mobile payment check status response.
 */
export async function getPaymentStatus({
  mobileStatusVerificationParams,
  paymentServiceConfig,
  endPoint,
}: {
  mobileStatusVerificationParams: GetOrangeMoneyPaymentRequest;
  paymentServiceConfig: OrangeMoneyPaymentParams;
  endPoint: string;
}): Promise<GetOrangeMoneyPaymentResponse> {
  const logger = paymentServiceConfig.logger;

  const headers = {
    [ApiKey.keyAuthorization]: `Bearer ${mobileStatusVerificationParams.accessToken}`,
    [ApiKey.keyContentType]: ConstantRequestField.typeJson,
    [ApiKey.keyXAuthToken]: paymentServiceConfig.xAuthToken,
  };

  logger.info(
    `[ORANGE MONEY] Checks the ORANGE MONEY Payment status with route: ${endPoint}`
  );

  const response = await getRequest<GenericRequestResponseData>({
    headers: headers,
    route: endPoint,
    logger: logger,
  });
  const responseData = response?.response;

  if (responseData && isSuccessfulCodeResponse(responseData.status)) {
    logger.log(
      `[ORANGE MONEY] Status verification successful with result ${JSON.stringify(
        responseData.data
      )}`
    );
    return {
      data: {
        status: responseData.data.data.status,
      },
      raw: responseData.data,
    };
  }

  logger.warn(
    `[ORANGE MONEY] Status verification failed with error data: ${JSON.stringify(
      response.error
    )}`
  );
  return {
    raw: response.error,
    error: ApiErrorType.failedToCheckPaymentStatus,
  };
}
