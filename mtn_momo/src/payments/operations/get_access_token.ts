import { ConstantRequestField } from "../../utils/constants";
import { encodeToBase64, postRequest } from "../../utils/https";
import { ApiErrorType, RequestKey } from "../utils/constants";
import {
  AccessTokenRequestResponseFromMtn,
  GetAccessTokenResponse,
  MtnMomoPaymentParams,
} from "../utils/request_model";

/**
 * Gets the access token for the API.
 *
 * @param {MtnMomoPaymentParams} paymentConfig - The payment configuration.
 * @param {string} endPoint - The end point route.
 * @return {Promise<GetAccessTokenResponse>} The access token response.
 */
export const getAccessToken = async (
  paymentConfig: MtnMomoPaymentParams,
  endPoint: string
): Promise<GetAccessTokenResponse> => {
  const logger = paymentConfig.logger;
  const encodeToBase64UserAndApikey = encodeToBase64(
    paymentConfig.apiUserKey,
    paymentConfig.apiKey
  );
  const authorization = `${ConstantRequestField.basic} ${encodeToBase64UserAndApikey}`;
  const header = {
    [RequestKey.keyAuthorization]: authorization,
    [RequestKey.keySubscriptionKey]: paymentConfig.ocpApimSubscriptionKey,
  };

  logger.info(
    `Generates the access token with data: \n- headers: ${JSON.stringify(
      header
    )}\n- route: ${endPoint}`
  );

  const response = await postRequest<AccessTokenRequestResponseFromMtn>({
    headers: header,
    route: endPoint,
    logger: logger,
  });

  const accessToken = response.response?.data?.access_token;

  if (response.error || !accessToken) {
    logger.warn(
      `Request failed to generate the access token. Error retrieved: ${JSON.stringify(
        response.error
      )}`
    );
    return {
      raw: response.error,
      error: ApiErrorType.failedToGenerateAccessToken,
    };
  }

  logger.info(
    `Access token successfully generated with data ${JSON.stringify(
      response.response?.data
    )}`
  );

  return {
    data: accessToken,
    raw: response.response?.data,
  };
};
