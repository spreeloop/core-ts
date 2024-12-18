import {
  encodeTheBodyOfRequest,
  encodeToBase64,
  postRequest,
} from '../../utils/https';
import { ApiErrorType, ApiKey, ConstantRequestField } from '../utils/constants';
import {
  AccessTokenRequestResponse,
  OrangeMoneyPaymentConfigs,
} from '../utils/joi_schema';
import { GetAccessTokenResponse } from '../utils/request_model';

/**
 * Gets the access token for the API.
 *
 * @param {OrangeMoneyPaymentParams} paymentConfig - The payment configuration.
 * @param {string} endPoint - The end point route.
 * @return {Promise<GetAccessTokenResponse>} The access token response.
 */
export const getAccessToken = async (
  paymentConfig: OrangeMoneyPaymentConfigs,
  endPoint: string
): Promise<GetAccessTokenResponse> => {
  const logger = paymentConfig.logger;

  const encodeToBase64UserAndPassword = encodeToBase64(
    paymentConfig.apiUserName,
    paymentConfig.apiPassword
  );
  const authorization = `Basic ${encodeToBase64UserAndPassword}`;
  const bodyRequest: Record<string, string> = {
    [ApiKey.keyGrantType]: 'client_credentials',
  };
  const options = {
    [ApiKey.keyAuthorization]: authorization,
    [ApiKey.keyContentType]: ConstantRequestField.TypeWwwFrom,
  };

  logger.info(
    `Generates the access token with data: \nheaders: ${JSON.stringify(
      options
    )}\ndata: ${JSON.stringify(
      encodeTheBodyOfRequest(bodyRequest)
    )}\nroute: ${endPoint}`
  );

  const result = await postRequest<AccessTokenRequestResponse>({
    headers: options,
    data: encodeTheBodyOfRequest(bodyRequest),
    route: endPoint,
    logger: logger,
  });
  const accessToken = result.response?.data?.access_token;

  if (result.error || !accessToken) {
    logger.warn(
      `Request failed to generate the access token. Error retrieved: ${JSON.stringify(
        result.error
      )}`
    );
    return {
      raw: result.error,
      error: ApiErrorType.failedToGenerateAccessToken,
    };
  }

  logger.info(
    `Access token successfully generated with data ${JSON.stringify(
      result.response?.data
    )}`
  );

  return {
    data: accessToken,
    raw: result.response?.data,
  };
};
