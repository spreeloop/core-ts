import {
  RequestResponse,
  RequestStatusCode,
  isSuccessfulCodeResponse,
  postRequest,
} from '../../utils/https';
import { Routes } from '../routes/routes';
import {
  ApiErrorType,
  ApiKey,
  ConstantRequestField,
  OrangeMoneyErrorMessage,
} from '../utils/constants';
import {
  GenericRequestResponseData,
  InitPaymentBodySchema,
  OrangeMoneyPaymentConfigs,
  initPaymentBodySchema,
} from '../utils/joi_schema';
import {
  InitializeOrangeMoneyRequest,
  InitializeOrangeMoneyResponse,
} from '../utils/request_model';
import { validateData } from '../utils/utils';

/**
 * Initiates the payment.
 *
 * @param {InitializeOmPaymentRequest} mobileInitParams - The mobile initialization parameters.
 * @param {string} endPoint - The init payment end point.
 * @param {OrangeMoneyPaymentParams} paymentConfig - The mobile payment config parameters.
 *    - {TargetEnvironment} paymentConfig.targetEnvironment - The target environment.
 *    - {string} paymentConfig.apiUserName - The api user name.
 *    - {string} paymentConfig.xAuthToken - The x-auth-token.
 *    - {string} paymentConfig.apiPassword - The api password.
 *    - {string} [paymentConfig.orangeMoneyVersion] - The orange money version.
 *    - {LoggerInterface} paymentConfig.logger - The logger interface.
 * @return {Promise<InitializeOrangeMoneyResponse>} The promise that resolves to the mobile payment initialization response.
 */
export async function initializeOmPayment({
  mobileInitParams,
  paymentConfig,
  endPoint,
}: {
  mobileInitParams: InitializeOrangeMoneyRequest;
  paymentConfig: OrangeMoneyPaymentConfigs;
  endPoint: string;
}): Promise<InitializeOrangeMoneyResponse> {
  const logger = paymentConfig.logger;

  const paymentParams = {
    mobileInitParams: mobileInitParams,
    paymentConfig: paymentConfig,
    endPoint: endPoint,
  };

  const response = await initializeOmPaymentInternal(paymentParams);

  if (response.schemaErrorMessage) {
    logger.warn(
      `[ORANGE MONEY] Initialization failed with error data: ${JSON.stringify(
        response.schemaErrorMessage
      )}`
    );
    return {
      raw: response.schemaErrorMessage,
      error: ApiErrorType.failedToInitiateThePayment,
    };
  }

  const requestResponse = response.requestResult?.response;

  if (requestResponse && isSuccessfulCodeResponse(requestResponse.status)) {
    logger.info(
      `[ORANGE MONEY] Initialization successful with result ${JSON.stringify(
        requestResponse.data
      )}`
    );
    return {
      data: {
        payToken: mobileInitParams.payToken,
      },
      raw: requestResponse.data,
    };
  }
  if (
    requestResponse &&
    requestResponse.status === RequestStatusCode.expectationFailed
  ) {
    const errorData = requestResponse.data.data;

    logger.warn(
      `[ORANGE MONEY] Initialization failed failed. Reason: ${errorData.inittxnmessage}`
    );
    return {
      raw: requestResponse.data,
      error: getApiErrorMessage(errorData.inittxnmessage),
    };
  }

  logger.warn(
    `[ORANGE MONEY] Initialization failed with error data: ${JSON.stringify(
      response.requestResult?.error
    )}`
  );

  return {
    error: ApiErrorType.failedToInitiateThePayment,
    raw: response.requestResult?.error,
  };
}

/**
 * Makes a payment request using the provided parameters.
 *
 * @param {Object} params - An object containing the following parameters:
 *   - {MobileInitPaymentParams} mobileInitParams: The mobile initialization parameters.
 *   - {PaymentConfig} paymentConfig - The mobile payment config parameters.
 *   - {string} endPoint: The init payment end point.
 * @return {Promise} A promise that resolves to the payment request response.
 */
const initializeOmPaymentInternal = async (params: {
  mobileInitParams: InitializeOrangeMoneyRequest;
  paymentConfig: OrangeMoneyPaymentConfigs;
  endPoint: string;
}): Promise<{
  requestResult?: RequestResponse<GenericRequestResponseData>;
  schemaErrorMessage?: string;
}> => {
  const routes = new Routes(params.paymentConfig.orangeMoneyVersion);
  const headers = {
    [ApiKey.keyAuthorization]: `Bearer ${params.mobileInitParams.accessToken}`,
    [ApiKey.keyContentType]: ConstantRequestField.typeJson,
    [ApiKey.keyXAuthToken]: params.paymentConfig.xAuthToken,
  };
  const body = {
    [ApiKey.keySubscriberMsisdn]: params.mobileInitParams.subscriberNumber,
    [ApiKey.keyChannelUserMsisdn]: params.mobileInitParams.channelUserNumber,
    [ApiKey.keyAmount]: params.mobileInitParams.amount.toString(),
    [ApiKey.keyDescription]: params.mobileInitParams.description,
    [ApiKey.keyMobileOrderId]: params.mobileInitParams.transactionId,
    [ApiKey.keyPin]: params.mobileInitParams.pinCode,
    [ApiKey.keyMobilePayToken]: params.mobileInitParams.payToken,
    [ApiKey.keyMobileNotifUrl]: params.mobileInitParams.notifUrl,
  };

  const dataValidation = validateData<InitPaymentBodySchema>(
    body,
    initPaymentBodySchema
  );

  if (!dataValidation.isValidData) {
    return { schemaErrorMessage: dataValidation.message };
  }

  params.paymentConfig.logger.info(
    `Initiate the ORANGE MONEY Payment with data: ${JSON.stringify(
      body
    )}\nroute: ${routes.mobileInitPayment()}`
  );

  const response = await postRequest<GenericRequestResponseData>({
    logger: params.paymentConfig.logger,
    headers: headers,
    data: body,
    route: routes.mobileInitPayment(),
  });

  return { requestResult: response };
};

/**
 * Maps an API error message to the corresponding API error type.
 *
 * @param {string} message - the error message to map
 * @return {ApiErrorType} the corresponding API error type
 */
const getApiErrorMessage = (message: string): ApiErrorType => {
  switch (message) {
    case OrangeMoneyErrorMessage.beneficiaryNotFound:
      return ApiErrorType.invalidOrangeMoneyNumber;
    case OrangeMoneyErrorMessage.insufficientFunds:
      return ApiErrorType.insufficientFunds;
    case OrangeMoneyErrorMessage.accountLocked:
      return ApiErrorType.accountLocked;
    case OrangeMoneyErrorMessage.invalidPaymentAmount:
      return ApiErrorType.invalidPaymentAmount;
    default:
      return ApiErrorType.failedToInitiateThePayment;
  }
};
