import {
  RequestResponse,
  encodeDataToXFormUrl,
  hash,
  postRequest,
} from '../../common/utils/https';
import { OperationResponse } from '../../common/utils/operation_response';
import {
  DisbursementServiceConfig,
  DisbursementServiceConfigSchema,
} from '../implementations/disbursement_service';

export type Token = {
  /**
   * The requested token.
   */
  access_token: string;

  scope?: string;

  /**
   * The type of the requested token.
   */
  token_type: string;

  /** The time to live in seconds. */
  expires_in: string;
};

export type CreateAccessTokenResponse = OperationResponse<string, Token>;

/**
 * Creates an access token.
 *
 * @param {CreateAccessTokenRequest} configs - The disbursement service config.
 * @param {string} endPoint - The end point.
 * @return {CreateAccessTokenResponse} The method response containing the access token and raw response.
 */
export async function createAccessToken({
  configs,
  endPoint,
}: {
  configs: DisbursementServiceConfig;
  endPoint: string;
}): Promise<CreateAccessTokenResponse> {
  const logger = configs.logger;
  logger.info('createAccessToken is running ...');
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
  const authorization = hash(configValues.clientId, configValues.clientSecret);
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${authorization}`,
  };
  const body = encodeDataToXFormUrl({
    grant_type: 'client_credentials',
  });
  const response: RequestResponse<Token> = await postRequest<Token>({
    logger: logger,
    route: endPoint,
    data: body,
    headers: headers,
    rejectUnauthorized: false,
  });

  if (!response.response) {
    return { error: response.error };
  }

  return {
    data: response.response.data.access_token,
    raw: response.response.data,
  };
}
