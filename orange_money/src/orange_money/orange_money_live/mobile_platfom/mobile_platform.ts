import {
  ApiKey,
  ConstantRequestField,
  OrangeMoneyErrorType,
  OrangePaymentStatus,
  orangeMoneyEndPoint,
} from '../../../constants';
import { LoggerInterface } from '../../../utils/logging_interface';
import {
  MobilePayTokenResponse,
  MobilePaymentCheckStatusResponse,
  MobilePaymentInitializationResponse,
  ProviderAccessTokenRequestResponse,
  ProviderPayTokenRequestResponse,
  ProviderPaymentRequestResponse,
  providerPaymentRequestResponseSchema,
} from '../../../utils/requests_responses';
import {
  MobileInitializationParams,
  MobileParamsForCheckStatus,
  ProvideInitializationBodySchema,
  provideInitializationBodySchema,
} from '../../../utils/resquest_params';
import {
  encodeTheBodyOfRequest,
  encodeToBase64,
  getRequest,
  isValidHttpSuccessfulStatus,
  postRequest,
  validateData,
} from '../../../utils/utils';

const routes = {
  initLivePayment(mobileOmVersion?: string) {
    const version = mobileOmVersion ?? '1.0.2';
    return `${orangeMoneyEndPoint}/omcoreapis/${version}/mp/pay`;
  },

  getPaymentStatusUrl(params: { mobileOmVersion?: string; payToken: string }) {
    const version = params.mobileOmVersion ?? '1.0.2';
    return `${orangeMoneyEndPoint}/omcoreapis/${version}/mp/paymentstatus/${params.payToken}`;
  },

  mobilePayTokenUrl(mobileOmVersion?: string) {
    const version = mobileOmVersion ?? '1.0.2';

    return `${orangeMoneyEndPoint}/omcoreapis/${version}/mp/init`;
  },

  mobileAccessTokenEndPoint() {
    return `${orangeMoneyEndPoint}/token`;
  },
};

const unauthorizedStatus = 401;

/**
 * The orange money mobile payment.
 */
export class MobilePayment {
  /**
   * Constructs a new MobilePayment Payment.
   * @param {LoggerInterface} logger - The logger instance. Defaults to a new Logger object.
   * @param {Function} getAccessTokenFromCache - The function to get the access token from cache.
   * @param {Function} updateAccessTokenCache - The function to update the cache access token.
   */
  constructor(
    public readonly logger: LoggerInterface,
    public readonly getAccessTokenFromCache: () => Promise<
      { accessToken: string; expirationTimeInUtc?: string | null } | undefined
    >,
    public readonly updateAccessTokenCache: (
      accessToken: string,
      accessTokenExpirationTimeInUtc: string
    ) => Promise<boolean>
  ) {}

  /**
   * Enter point to initiate the orange money mobile payment.
   * @param {MobileInitializationParams} mobileInitParams the necessary parameters to initialize the mobile payment.
   * @return {MobilePaymentInitializationResponse} the response of initialization.
   *
   **/
  async initializeMobilePayment(
    mobileInitParams: MobileInitializationParams
  ): Promise<MobilePaymentInitializationResponse> {
    // Generates the pay-token.
    const payTokenResult = await generatePayToken({
      mobileOmVersion: mobileInitParams.orangeMoneyVersion,
      xAuthToken: mobileInitParams.xAuthToken,
      logger: this.logger,
      apiPassword: mobileInitParams.apiPassword,
      apiUserName: mobileInitParams.apiUserName,
      getAccessTokenFromCache: this.getAccessTokenFromCache,
      updateAccessTokenCache: this.updateAccessTokenCache,
    });

    if (!payTokenResult) {
      return {
        orangeMoneyError: OrangeMoneyErrorType.failToGeneratePayToken,
      };
    }

    // Initiates the payment.
    return initiateMobilePayment({
      mobileOmVersion: mobileInitParams.orangeMoneyVersion,
      transactionId: mobileInitParams.transactionId,
      amount: mobileInitParams.amount,
      xAuthToken: mobileInitParams.xAuthToken,
      userPhoneNumber: mobileInitParams.userPhoneNumber,
      notifUrl: mobileInitParams.notifUrl,
      description: mobileInitParams.description,
      pinCode: mobileInitParams.pinCode,
      receiverPhoneNumber: mobileInitParams.receiverPhoneNumber,
      payToken: payTokenResult.payToken,
      logger: this.logger,
      apiPassword: mobileInitParams.apiPassword,
      apiUserName: mobileInitParams.apiUserName,
      getAccessTokenFromCache: this.getAccessTokenFromCache,
      updateAccessTokenCache: this.updateAccessTokenCache,
    });
  }

  /**
   * Gets The mobile orange money payment status.
   * @param {MobileParamsForCheckStatus} mobileCheckStatusParams the necessary parameters to get the mobile payment status.
   * @return {string} the response who contains the payment state.
   */
  async checkMobilePaymentStatus(
    mobileCheckStatusParams: MobileParamsForCheckStatus
  ): Promise<MobilePaymentCheckStatusResponse> {
    const result = await checkPaymentStatus({
      mobileOmVersion: mobileCheckStatusParams.mobileOmVersion,
      xAuthToken: mobileCheckStatusParams.xAuthToken,
      paytoken: mobileCheckStatusParams.payToken,
      apiUserName: mobileCheckStatusParams.apiUserName,
      apiPassword: mobileCheckStatusParams.apiPassword,
      logger: this.logger,
      getAccessTokenFromCache: this.getAccessTokenFromCache,
      updateAccessTokenCache: this.updateAccessTokenCache,
    });

    return result;
  }
}

const checkPaymentStatus = async (params: {
  apiUserName: string;
  apiPassword: string;
  xAuthToken: string;
  paytoken: string;
  mobileOmVersion?: string;
  logger: LoggerInterface;
  getAccessTokenFromCache: () => Promise<
    { accessToken: string; expirationTimeInUtc?: string | null } | undefined
  >;
  updateAccessTokenCache: (
    accessToken: string,
    accessTokenExpirationTimeInUtc: string
  ) => Promise<boolean>;
}): Promise<MobilePaymentCheckStatusResponse> => {
  const enPointURL = routes.getPaymentStatusUrl({
    payToken: params.paytoken,
    mobileOmVersion: params.mobileOmVersion,
  });

  let accessToken = await getAccessTokenWrapper({
    generateNewAccessToken: false,
    apiPassword: params.apiPassword,
    apiUserName: params.apiUserName,
    logger: params.logger,
    getAccessTokenFromCache: params.getAccessTokenFromCache,
    updateAccessTokenCache: params.updateAccessTokenCache,
  });
  if (accessToken === undefined) {
    return {
      orangeMoneyError: OrangeMoneyErrorType.failToGenerateAccessToken,
    };
  }

  let response = await makeStatusChecksRequest({
    accessToken: accessToken,
    enPointURL: enPointURL,
    logger: params.logger,
    xAuthToken: params.xAuthToken,
  });

  if (response.status === unauthorizedStatus) {
    accessToken = await getAccessTokenWrapper({
      generateNewAccessToken: true,
      apiPassword: params.apiPassword,
      apiUserName: params.apiUserName,
      logger: params.logger,
      getAccessTokenFromCache: params.getAccessTokenFromCache,
      updateAccessTokenCache: params.updateAccessTokenCache,
    });

    if (accessToken === undefined)
      return {
        orangeMoneyError: OrangeMoneyErrorType.failToGenerateAccessToken,
      };

    response = await makeStatusChecksRequest({
      accessToken: accessToken,
      enPointURL: enPointURL,
      logger: params.logger,
      xAuthToken: params.xAuthToken,
    });
  }

  const checkStatusResult = validateData<ProviderPaymentRequestResponse>(
    response.data,
    providerPaymentRequestResponseSchema
  );

  if (
    isValidHttpSuccessfulStatus(response.status) &&
    checkStatusResult.isValidData
  ) {
    params.logger.info(
      `Status successful retrieve with result: ${checkStatusResult.data.data.status}`
    );
    return { status: checkStatusResult.data.data.status };
  }

  params.logger.error(
    `Request failed to get the payment status. Request Status ${response.status}, data:${response.error}`
  );

  return {
    orangeMoneyError: OrangeMoneyErrorType.failToCheckPaymentStatus,
  };
};

const getAccessTokenWrapper = async (params: {
  apiUserName: string;
  apiPassword: string;
  mobileOmVersion?: string;
  logger: LoggerInterface;
  generateNewAccessToken: boolean;
  getAccessTokenFromCache: () => Promise<
    { accessToken: string; expirationTimeInUtc?: string | null } | undefined
  >;
  updateAccessTokenCache: (
    accessToken: string,
    accessTokenExpirationTimeInUtc: string
  ) => Promise<boolean>;
}): Promise<string | undefined> => {
  const accessToken = await getAccessToken({
    apiPassword: params.apiPassword,
    apiUserName: params.apiUserName,
    logger: params.logger,
    getAccessTokenFromCache: params.getAccessTokenFromCache,
    updateAccessTokenCache: params.updateAccessTokenCache,
    generateNewAccessToken: params.generateNewAccessToken,
  });

  if (!accessToken) {
    params.logger.info(
      'Failed to retrieve or generate the access token to check the payment status.'
    );
    return;
  }

  return accessToken;
};

const makeStatusChecksRequest = async (params: {
  accessToken: string;
  xAuthToken: string;
  enPointURL: string;
  logger: LoggerInterface;
}) => {
  const headers = {
    [ApiKey.keyAuthorization]: `Bearer ${params.accessToken}`,
    [ApiKey.keyContentType]: ConstantRequestField.typeJson,
    [ApiKey.keyXAuthToken]: params.xAuthToken,
  };

  const response = await getRequest<ProviderPaymentRequestResponse>({
    headers: headers,
    route: params.enPointURL,
    logger: params.logger,
  });

  return response;
};

/**
 * Initialize the payment.
 * @param {Record<string, unknown>} params Required parameter.
 */
async function initiateMobilePayment(params: {
  mobileOmVersion?: string;
  transactionId: string;
  amount: number;
  xAuthToken: string;
  userPhoneNumber: string;
  notifUrl?: string;
  description?: string;
  pinCode: string;
  receiverPhoneNumber: string;
  payToken: string;
  logger: LoggerInterface;
  apiPassword: string;
  apiUserName: string;
  getAccessTokenFromCache: () => Promise<
    { accessToken: string; expirationTimeInUtc?: string | null } | undefined
  >;
  updateAccessTokenCache: (
    accessToken: string,
    accessTokenExpirationTimeInUtc: string
  ) => Promise<boolean>;
}): Promise<MobilePaymentInitializationResponse> {
  let accessToken = await getAccessTokenWrapper({
    generateNewAccessToken: false,
    apiPassword: params.apiPassword,
    apiUserName: params.apiUserName,
    logger: params.logger,
    getAccessTokenFromCache: params.getAccessTokenFromCache,
    updateAccessTokenCache: params.updateAccessTokenCache,
  });
  if (accessToken === undefined) {
    return {
      orangeMoneyError: OrangeMoneyErrorType.failToGenerateAccessToken,
    };
  }

  let response = await makePaymentRequest({
    accessToken: accessToken,
    transactionId: params.transactionId,
    amount: params.amount,
    xAuthToken: params.xAuthToken,
    userPhoneNumber: params.userPhoneNumber,
    notifUrl: params.notifUrl,
    description: params.description,
    pinCode: params.pinCode,
    receiverPhoneNumber: params.receiverPhoneNumber,
    payToken: params.payToken,
    logger: params.logger,
    apiPassword: params.apiPassword,
    apiUserName: params.apiUserName,
    mobileOmVersion: params.mobileOmVersion,
  });

  if (response.status === unauthorizedStatus) {
    accessToken = await getAccessTokenWrapper({
      generateNewAccessToken: true,
      apiPassword: params.apiPassword,
      apiUserName: params.apiUserName,
      logger: params.logger,
      getAccessTokenFromCache: params.getAccessTokenFromCache,
      updateAccessTokenCache: params.updateAccessTokenCache,
    });
    if (accessToken === undefined) {
      return {
        orangeMoneyError: OrangeMoneyErrorType.failToGenerateAccessToken,
      };
    }

    response = await makePaymentRequest({
      accessToken: accessToken,
      transactionId: params.transactionId,
      amount: params.amount,
      xAuthToken: params.xAuthToken,
      userPhoneNumber: params.userPhoneNumber,
      notifUrl: params.notifUrl,
      description: params.description,
      pinCode: params.pinCode,
      receiverPhoneNumber: params.receiverPhoneNumber,
      payToken: params.payToken,
      logger: params.logger,
      apiPassword: params.apiPassword,
      apiUserName: params.apiUserName,
      mobileOmVersion: params.mobileOmVersion,
    });
  }
  const paymentResult = validateData<ProviderPaymentRequestResponse>(
    response.data,
    providerPaymentRequestResponseSchema
  );

  if (
    isValidHttpSuccessfulStatus(response.status) &&
    paymentResult.isValidData
  ) {
    return {
      status: OrangePaymentStatus.PENDING_PAYMENT,
      payToken: paymentResult.data.data.payToken,
    };
  }
  if (response.status === 417) {
    return retrieveFailedPaymentResponse({
      status: response.status,
      logger: params.logger,
      error: response.error,
      userPhoneNumber: params.userPhoneNumber,
    });
  }

  params.logger.error(
    `Orange money Initialization failed with status ${
      response.status
    }, and error data: ${JSON.stringify(response.error)}`
  );

  return {
    orangeMoneyError: OrangeMoneyErrorType.failToInitiateThePayment,
  };
}

const makePaymentRequest = async (params: {
  mobileOmVersion?: string;
  transactionId: string;
  amount: number;
  notifUrl?: string;
  description?: string;
  pinCode: string;
  payToken: string;
  apiPassword: string;
  apiUserName: string;
  accessToken: string;
  receiverPhoneNumber: string;
  userPhoneNumber: string;
  xAuthToken: string;
  logger: LoggerInterface;
}) => {
  const headers = {
    [ApiKey.keyAuthorization]: `Bearer ${params.accessToken}`,
    [ApiKey.keyContentType]: ConstantRequestField.typeJson,
    [ApiKey.keyXAuthToken]: params.xAuthToken,
  };
  const body = {
    [ApiKey.keySubscriberMsisdn]: params.userPhoneNumber,
    [ApiKey.keyChannelUserMsisdn]: params.receiverPhoneNumber,
    [ApiKey.keyAmount]: params.amount.toString(),
    [ApiKey.keyDescription]: params.description,
    [ApiKey.keyMobileOrderId]: params.transactionId,
    [ApiKey.keyPin]: params.pinCode,
    [ApiKey.keyMobilePayToken]: params.payToken,
    [ApiKey.keyMobileNotifUrl]: params.notifUrl,
  };

  params.logger.info(
    `Initiate the ORANGE MONEY Payment with data: \nheaders: ${JSON.stringify(
      headers
    )}\ndata: ${JSON.stringify(body)}\nroute: ${routes.initLivePayment(
      params.mobileOmVersion
    )}`
  );

  const response = await postRequest<
    ProviderPaymentRequestResponse,
    ProvideInitializationBodySchema
  >({
    logger: params.logger,
    headers: headers,
    data: body,
    route: routes.initLivePayment(params.mobileOmVersion),
    bodySchema: provideInitializationBodySchema,
  });

  return response;
};

/**
 * Retrieves the response on payment failed.
 * @param {Record<string, unknown>} params Required parameter.
 * @return {MobilePaymentInitializationResponse} .
 */
function retrieveFailedPaymentResponse(params: {
  status: number;
  logger: LoggerInterface;
  error: unknown;
  userPhoneNumber: string;
}): MobilePaymentInitializationResponse {
  const result = validateData<ProviderPaymentRequestResponse>(
    params.error,
    providerPaymentRequestResponseSchema
  );
  if (!result.isValidData) {
    params.logger.warn(
      `Orange money Initialization from number ${
        params.userPhoneNumber
      } failed with status ${params.status}, Raison: ${JSON.stringify(
        params.error
      )}`
    );
    return {
      orangeMoneyError: OrangeMoneyErrorType.failToInitiateThePayment,
    };
  }
  const data = result.data.data;
  if (data.inittxnmessage === 'Beneficiaire introuvable') {
    params.logger.warn(
      `Orange money Initialization from number ${params.userPhoneNumber} failed with status ${params.status}, Raison: ${data.inittxnmessage}`
    );
    return {
      orangeMoneyError: OrangeMoneyErrorType.invalidOrangeMoneyNumber,
    };
  }
  if (data.inittxnmessage === 'Le solde du compte du payeur est insuffisant') {
    params.logger.warn(
      `Orange money Initialization from number ${params.userPhoneNumber} failed with status ${params.status}, Raison: ${data.inittxnmessage}`
    );
    return {
      orangeMoneyError: OrangeMoneyErrorType.insufficientFunds,
    };
  }
  if (data.inittxnmessage === 'Utilisateur bloque') {
    params.logger.warn(
      `Orange money Initialization from number ${params.userPhoneNumber} failed with status ${params.status}, Raison: ${data.inittxnmessage}`
    );
    return {
      orangeMoneyError: OrangeMoneyErrorType.lockAccount,
    };
  }
  if (
    data.inittxnmessage ===
    'Vous avez saisi un montant superieur au montant maximum autorise'
  ) {
    params.logger.warn(
      `Orange money Initialization from number ${params.userPhoneNumber} failed with status ${params.status}, Raison: ${data.inittxnmessage}`
    );
    return {
      orangeMoneyError: OrangeMoneyErrorType.invalidPaymentAmount,
    };
  }
  params.logger.error(
    `Orange money Initialization from number ${
      params.userPhoneNumber
    } failed with status ${params.status}, Raison: ${JSON.stringify(
      params.error
    )}`
  );
  return {
    orangeMoneyError: OrangeMoneyErrorType.failToInitiateThePayment,
  };
}

const getAccessToken = async ({
  apiUserName,
  apiPassword,
  logger,
  getAccessTokenFromCache,
  updateAccessTokenCache,
  generateNewAccessToken,
}: {
  apiUserName: string;
  apiPassword: string;
  logger: LoggerInterface;
  getAccessTokenFromCache: () => Promise<
    { accessToken: string; expirationTimeInUtc?: string | null } | undefined
  >;
  updateAccessTokenCache: (
    accessToken: string,
    accessTokenExpirationTimeInUtc: string
  ) => Promise<boolean>;
  generateNewAccessToken: boolean;
}): Promise<string | undefined> => {
  const result = await getAccessTokenFromCache();

  if (result && !generateNewAccessToken) {
    logger.info(
      `Retrieved the access token from cache with data: ${JSON.stringify(
        result
      )}`
    );
    return result.accessToken;
  }

  // Encode api_user and api_password to base 64.
  const encodeToBase64UserAndPassword = encodeToBase64(
    apiUserName,
    apiPassword
  );
  const authorization = `Basic ${encodeToBase64UserAndPassword}`;
  const bodyRequest: Record<string, string> = {
    [ApiKey.keyGrantType]: 'client_credentials',
  };
  const endPoint = routes.mobileAccessTokenEndPoint();
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
  const response = await postRequest<ProviderAccessTokenRequestResponse>({
    headers: options,
    data: encodeTheBodyOfRequest(bodyRequest),
    route: endPoint,
    logger: logger,
  });
  if (
    !isValidHttpSuccessfulStatus(response.status) ||
    response.data === undefined
  ) {
    logger.error(
      `Request failed to generate the access token. Request status ${response.status} and data: ${response.error}`
    );
    return;
  }
  const data = response.data;
  const durationInSeconds = data.expires_in;
  const referencePoint = new Date();

  // Add the duration to the reference point to get the UTC time
  const utcTime = new Date(referencePoint.getTime() + durationInSeconds * 1000);

  logger.info(
    `New access token generated and expires at ${utcTime.toISOString()}`
  );

  await updateAccessTokenCache(data.access_token, utcTime.toISOString());

  return data.access_token;
};

/**
 * Generates the payToken useful to get the payment status.
 * @param {Record<string, string>} params the essential information needed for mobile request.
 */
const generatePayToken = async (params: {
  mobileOmVersion?: string;
  xAuthToken: string;
  logger: LoggerInterface;
  apiPassword: string;
  apiUserName: string;
  getAccessTokenFromCache: () => Promise<
    { accessToken: string; expirationTimeInUtc?: string | null } | undefined
  >;
  updateAccessTokenCache: (
    accessToken: string,
    accessTokenExpirationTimeInUtc: string
  ) => Promise<boolean>;
}): Promise<MobilePayTokenResponse | undefined> => {
  const accessToken = await getAccessToken({
    apiPassword: params.apiPassword,
    apiUserName: params.apiUserName,
    logger: params.logger,
    getAccessTokenFromCache: params.getAccessTokenFromCache,
    updateAccessTokenCache: params.updateAccessTokenCache,
    generateNewAccessToken: false,
  });

  if (!accessToken) {
    params.logger.error(
      'Backend failed to generate the access-token for payToken request'
    );
    return;
  }
  const headers = {
    [ApiKey.keyAuthorization]: `Bearer ${accessToken}`,
    [ApiKey.keyContentType]: ConstantRequestField.typeJson,
    [ApiKey.keyXAuthToken]: params.xAuthToken,
  };
  params.logger.info(
    `Generates the paytoken token with data: \nheaders: ${JSON.stringify(
      headers
    )}\nroute: ${routes.mobilePayTokenUrl(params.mobileOmVersion)}`
  );
  const response = await postRequest<ProviderPayTokenRequestResponse>({
    headers: headers,
    logger: params.logger,
    route: routes.mobilePayTokenUrl(params.mobileOmVersion),
  });

  if (
    isValidHttpSuccessfulStatus(response.status) &&
    response.data !== undefined
  ) {
    return {
      payToken: response.data.data.payToken,
    };
  }

  if (response.status !== unauthorizedStatus) {
    params.logger.error(
      `Request failed to generate the payToken. Request status ${response.status} data ${response.error}`
    );

    return;
  }

  // Force-retrieve a new access token.
  const newAccessToken = await getAccessToken({
    apiPassword: params.apiPassword,
    apiUserName: params.apiUserName,
    logger: params.logger,
    getAccessTokenFromCache: params.getAccessTokenFromCache,
    updateAccessTokenCache: params.updateAccessTokenCache,
    generateNewAccessToken: true,
  });
  if (!newAccessToken) {
    params.logger.error(
      'Request failed to generate the access-token to generate the payToken'
    );

    return;
  }
  const newHeaders = {
    [ApiKey.keyAuthorization]: `Bearer ${newAccessToken}`,
    [ApiKey.keyContentType]: ConstantRequestField.typeJson,
    [ApiKey.keyXAuthToken]: params.xAuthToken,
  };
  const newResponse = await postRequest<ProviderPayTokenRequestResponse>({
    headers: newHeaders,
    logger: params.logger,
    route: routes.mobilePayTokenUrl(params.mobileOmVersion),
  });

  if (
    isValidHttpSuccessfulStatus(newResponse.status) &&
    newResponse.data !== undefined
  ) {
    return {
      payToken: newResponse.data.data.payToken,
    };
  }
  params.logger.error(
    `Request failed to generate the payToken. Request status ${newResponse.status} data ${newResponse.error}`
  );

  return;
};

/**
 * Objects exported for testing.
 */
export const exportedForMobileTesting = {
  getAccessToken,
  generatePayToken,
  initiateMobilePayment,
  checkPaymentStatus,
};
