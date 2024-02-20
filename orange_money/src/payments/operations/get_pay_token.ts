import { postRequest } from '../../utils/https';
import { ApiErrorType, ApiKey, ConstantRequestField } from '../utils/constants';
import {
  OrangeMoneyPaymentParams,
  PayTokenRequestResponse,
} from '../utils/joi_schema';
import { GetPayTokenResponse } from '../utils/request_model';

/**
 * Gets a pay token using the provided payment configuration.
 *
 * @param {OrangeMoneyPaymentParams} paymentConfig - The payment configuration.
 * @param {OrangeMoneyPaymentParams} accessToken - The payment configuration.
 * @param {string} endPoint - The payToken endpoint.
 * @return {Promise<GetPayTokenResponse>} The generated pay token response.
 */
export const getPayToken = async (
  paymentConfig: OrangeMoneyPaymentParams,
  accessToken: string,
  endPoint: string
): Promise<GetPayTokenResponse> => {
  const logger = paymentConfig.logger;

  logger.info(
    `Request to generate the pay-token token using the provided payment configuration: ${JSON.stringify(
      paymentConfig
    )}`
  );

  const headers = {
    [ApiKey.keyAuthorization]: `Bearer ${accessToken}`,
    [ApiKey.keyContentType]: ConstantRequestField.typeJson,
    [ApiKey.keyXAuthToken]: paymentConfig.xAuthToken,
  };

  const result = await postRequest<PayTokenRequestResponse>({
    headers: headers,
    logger: logger,
    route: endPoint,
  });

  const payToken = result.response?.data?.data?.payToken;

  if (result.error || !payToken) {
    logger.warn(
      `Request failed to generate the pay-token. Error retrieved: ${JSON.stringify(
        result.error
      )}`
    );
    return {
      raw: result.error,
      error: ApiErrorType.failedToGeneratePayToken,
    };
  }

  logger.info(
    `Pay-token generated successfully with data: ${JSON.stringify(
      result.response?.data
    )}`
  );

  return {
    raw: result.response?.data,
    data: payToken,
  };
};
