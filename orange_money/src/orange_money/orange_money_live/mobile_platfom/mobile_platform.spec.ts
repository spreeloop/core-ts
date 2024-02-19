import { Logger } from '@spreeloop-core/logging';
import { OrangeMoneyErrorType, OrangePaymentStatus } from '../../../constants';
import {
  AccessTokenResponse,
  MobilePayTokenResponse,
} from '../../../utils/requests_responses';
import {
  MobileInitializationParams,
  MobileParamsForCheckStatus,
} from '../../../utils/resquest_params';
import * as requests from '../../../utils/utils';
import { exportedForMobileTesting } from './mobile_platform';

const mobileAccessTokenResponse: AccessTokenResponse = {
  accessToken: '1e23bee1-37dc-3015-a7d6-cb70e566bd64',
};
const mobilePayTokenResponse: MobilePayTokenResponse = {
  payToken: 'MP220807558VEF7A9C4F09AED',
};

const logger = new Logger();
const fakeNow = new Date(2022, 1, 10, 11, 20, 0, 0);

describe('Test the generation of access-token', () => {
  let accessToken: string | undefined;

  const getAccessTokenFromCache = async (): Promise<
    { accessToken: string; expirationTimeInUtc?: string | null } | undefined
  > => {
    return accessToken === undefined
      ? undefined
      : {
          accessToken: accessToken,
          expirationTimeInUtc: fakeNow.toISOString(),
        };
  };
  const updateAccessTokenCache = async (newAccessToken: string) => {
    accessToken = newAccessToken;
    return true;
  };
  const mobileInitiateParams: MobileInitializationParams = {
    amount: 100,
    apiPassword: 'secret',
    apiUserName: 'secret',
    notifUrl: 'https://localhost',
    transactionId: '1',
    pinCode: '123',
    receiverPhoneNumber: '698526541',
    userPhoneNumber: '698526541',
    xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
  };
  it('Generates the access token failed', async () => {
    jest.spyOn(requests, 'postRequest').mockResolvedValue({
      status: 401,
      data: 'invalid client credentials',
    });
    const result = await exportedForMobileTesting.getAccessToken({
      apiPassword: mobileInitiateParams.apiPassword,
      apiUserName: mobileInitiateParams.apiUserName,
      logger: logger,
      generateNewAccessToken: false,
      getAccessTokenFromCache: getAccessTokenFromCache,
      updateAccessTokenCache: updateAccessTokenCache,
    });
    expect(result).toBeUndefined();
  });

  it('Generates the access token success when the save token is undefined', async () => {
    jest.spyOn(requests, 'postRequest').mockResolvedValue({
      status: 200,
      data: {
        access_token: '1e23bee1-37dc-3015-a7d6-cb70e566bd64',
        expires_in: 3500,
      },
    });

    expect(accessToken).toBeUndefined();

    const result = await exportedForMobileTesting.getAccessToken({
      apiPassword: mobileInitiateParams.apiPassword,
      apiUserName: mobileInitiateParams.apiUserName,
      logger: logger,
      generateNewAccessToken: false,
      getAccessTokenFromCache: getAccessTokenFromCache,
      updateAccessTokenCache: updateAccessTokenCache,
    });
    expect(result).toBe(mobileAccessTokenResponse.accessToken);
    expect(accessToken).toBe(mobileAccessTokenResponse.accessToken);
  });
  it('Retrieves the old access token on request to access token.', async () => {
    await exportedForMobileTesting.getAccessToken({
      apiPassword: mobileInitiateParams.apiPassword,
      apiUserName: mobileInitiateParams.apiUserName,
      logger: logger,
      generateNewAccessToken: false,
      getAccessTokenFromCache: getAccessTokenFromCache,
      updateAccessTokenCache: updateAccessTokenCache,
    });
    expect(accessToken).toBe(mobileAccessTokenResponse.accessToken);
  });
});
describe('Test the generation of payToken', () => {
  let accessToken: string | undefined;
  const getAccessTokenFromCache = async (): Promise<
    | { accessToken: string; expirationTimeInUtc: string | null | undefined }
    | undefined
  > => {
    return accessToken === undefined
      ? undefined
      : {
          accessToken: accessToken,
          expirationTimeInUtc: fakeNow.toISOString(),
        };
  };
  const updateAccessTokenCache = async (newAccessToken: string) => {
    accessToken = newAccessToken;
    return true;
  };
  const mobileInitiateParams: MobileInitializationParams = {
    amount: 100,
    apiPassword: 'secret',
    apiUserName: 'secret',
    notifUrl: 'https://localhost',
    transactionId: '1',
    pinCode: '123',
    receiverPhoneNumber: '698526541',
    userPhoneNumber: '698526541',
    xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
  };
  it('Generate the payToken failed due to invalid credential.', async () => {
    const result = await exportedForMobileTesting.generatePayToken({
      xAuthToken: mobileInitiateParams.xAuthToken,
      logger: logger,
      apiPassword: mobileInitiateParams.apiPassword,
      apiUserName: mobileInitiateParams.apiUserName,
      getAccessTokenFromCache: getAccessTokenFromCache,
      updateAccessTokenCache: updateAccessTokenCache,
    });
    expect(result).toBeUndefined();
  });
  it('Generate the payToken successfully', async () => {
    expect(accessToken).toBeUndefined();
    jest
      .spyOn(requests, 'postRequest')
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: {
            access_token: '1e23bee1-37dc-3015-a7d6-cb70e566bd64',
            expires_in: 3500,
          },
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: {
            message: 'Payment request successfully initiated',
            data: {
              payToken: 'MP220807558VEF7A9C4F09AED',
            },
          },
        })
      );
    const result = await exportedForMobileTesting.generatePayToken({
      xAuthToken: mobileInitiateParams.xAuthToken,
      logger: logger,
      apiPassword: mobileInitiateParams.apiPassword,
      apiUserName: mobileInitiateParams.apiUserName,
      getAccessTokenFromCache: getAccessTokenFromCache,
      updateAccessTokenCache: updateAccessTokenCache,
    });
    expect(result?.payToken).toBe(mobilePayTokenResponse.payToken);
    expect(accessToken).toBe(mobileAccessTokenResponse.accessToken);
  });
});

describe('Test the initialization of payment', () => {
  let accessToken: string | undefined;
  const getAccessTokenFromCache = async (): Promise<
    | { accessToken: string; expirationTimeInUtc: string | null | undefined }
    | undefined
  > => {
    return accessToken === undefined
      ? undefined
      : {
          accessToken: accessToken,
          expirationTimeInUtc: fakeNow.toISOString(),
        };
  };
  const updateAccessTokenCache = async (newAccessToken: string) => {
    accessToken = newAccessToken;
    return true;
  };
  const mobileInitiateParams: MobileInitializationParams = {
    amount: 100,
    apiPassword: 'secret',
    apiUserName: 'secret',
    notifUrl: 'https://localhost',
    transactionId: '1',
    pinCode: '123',
    receiverPhoneNumber: '698526541',
    userPhoneNumber: '698526541',
    xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
  };

  it('Initialization failed cause of insufficient balance', async () => {
    jest
      .spyOn(requests, 'postRequest')
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: {
            access_token: '02c96d76-f7dc-357c-af8d-9e3ff95b87b6',
            scope: 'am_application_scope default',
            token_type: 'Bearer',
            expires_in: 3600,
          },
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 417,
          error: {
            message: '60019 :: Le solde du compte du payeur est insuffisant',
            data: {
              id: 75742131,
              createtime: '1682612128',
              subscriberMsisdn: '237696689073',
              amount: 90,
              payToken: 'MP2304270429730CE5AC78D276A6',
              txnid: null,
              txnmode: '84d1uhuhiuhiliubi',
              inittxnmessage: 'Le solde du compte du payeur est insuffisant',
              inittxnstatus: '60019',
              confirmtxnstatus: null,
              confirmtxnmessage: null,
              status: 'FAILED',
              notifUrl: '',
              description: '',
              channelUserMsisdn: '696431937',
            },
          },
        })
      );
    const result = await exportedForMobileTesting.initiateMobilePayment({
      mobileOmVersion: mobileInitiateParams.orangeMoneyVersion,
      transactionId: mobileInitiateParams.transactionId,
      amount: mobileInitiateParams.amount,
      xAuthToken: mobileInitiateParams.xAuthToken,
      userPhoneNumber: mobileInitiateParams.userPhoneNumber,
      notifUrl: mobileInitiateParams.notifUrl,
      description: mobileInitiateParams.description,
      pinCode: mobileInitiateParams.pinCode,
      receiverPhoneNumber: '688526541',
      payToken: 'MP220807558VEF7A9C4F09AED',
      logger: logger,
      getAccessTokenFromCache: getAccessTokenFromCache,
      updateAccessTokenCache: updateAccessTokenCache,
      apiPassword: mobileInitiateParams.apiPassword,
      apiUserName: mobileInitiateParams.apiUserName,
    });
    expect('orangeMoneyError' in result && result.orangeMoneyError).toEqual(
      OrangeMoneyErrorType.insufficientFunds
    );
  });
  it('Initialization failed cause of account blocked ', async () => {
    jest.spyOn(requests, 'postRequest').mockResolvedValue({
      status: 417,
      error: {
        message: '60019 :: Utilisateur bloque',
        data: {
          id: 75742131,
          createtime: '1682612128',
          subscriberMsisdn: '237696689073',
          amount: 90,
          payToken: 'MP2304270429730CE5AC78D276A6',
          txnid: null,
          txnmode: '84d1uhuhiuhiliubi',
          inittxnmessage: 'Utilisateur bloque',
          inittxnstatus: '60019',
          confirmtxnstatus: null,
          confirmtxnmessage: null,
          status: 'FAILED',
          notifUrl: '',
          description: '',
          channelUserMsisdn: '696431937',
        },
      },
    });
    const result = await exportedForMobileTesting.initiateMobilePayment({
      mobileOmVersion: mobileInitiateParams.orangeMoneyVersion,
      transactionId: mobileInitiateParams.transactionId,
      amount: mobileInitiateParams.amount,
      xAuthToken: mobileInitiateParams.xAuthToken,
      userPhoneNumber: mobileInitiateParams.userPhoneNumber,
      notifUrl: mobileInitiateParams.notifUrl,
      description: mobileInitiateParams.description,
      pinCode: mobileInitiateParams.pinCode,
      receiverPhoneNumber: mobileInitiateParams.receiverPhoneNumber,
      payToken: 'MP220807558VEF7A9C4F09AED',
      logger: logger,
      getAccessTokenFromCache: getAccessTokenFromCache,
      updateAccessTokenCache: updateAccessTokenCache,
      apiPassword: mobileInitiateParams.apiPassword,
      apiUserName: mobileInitiateParams.apiUserName,
    });
    expect('orangeMoneyError' in result && result.orangeMoneyError).toEqual(
      OrangeMoneyErrorType.lockAccount
    );
  });
  it('Initialization failed cause of invalid orange money account', async () => {
    jest.spyOn(requests, 'postRequest').mockResolvedValue({
      status: 417,
      error: {
        message: '60019 :: Beneficiaire introuvable',
        data: {
          id: 75742131,
          createtime: '1682612128',
          subscriberMsisdn: '237696689073',
          amount: 90,
          payToken: 'MP2304270429730CE5AC78D276A6',
          txnid: null,
          txnmode: '84d1uhuhiuhiliubi',
          inittxnmessage: 'Beneficiaire introuvable',
          inittxnstatus: '60019',
          confirmtxnstatus: null,
          confirmtxnmessage: null,
          status: 'FAILED',
          notifUrl: '',
          description: '',
          channelUserMsisdn: '696431937',
        },
      },
    });
    const result = await exportedForMobileTesting.initiateMobilePayment({
      mobileOmVersion: mobileInitiateParams.orangeMoneyVersion,
      transactionId: mobileInitiateParams.transactionId,
      amount: mobileInitiateParams.amount,
      xAuthToken: mobileInitiateParams.xAuthToken,
      userPhoneNumber: mobileInitiateParams.userPhoneNumber,
      notifUrl: mobileInitiateParams.notifUrl,
      description: mobileInitiateParams.description,
      pinCode: mobileInitiateParams.pinCode,
      receiverPhoneNumber: mobileInitiateParams.receiverPhoneNumber,
      payToken: 'MP220807558VEF7A9C4F09AED',
      logger: logger,
      getAccessTokenFromCache: getAccessTokenFromCache,
      updateAccessTokenCache: updateAccessTokenCache,
      apiPassword: mobileInitiateParams.apiPassword,
      apiUserName: mobileInitiateParams.apiUserName,
    });
    expect('orangeMoneyError' in result && result.orangeMoneyError).toEqual(
      OrangeMoneyErrorType.invalidOrangeMoneyNumber
    );
  });
  it('Initialization failed cause of invalid payment amount', async () => {
    jest.spyOn(requests, 'postRequest').mockResolvedValue({
      status: 417,
      error: {
        message:
          '60019 :: Vous avez saisi un montant superieur au montant maximum autorise',
        data: {
          id: 75742131,
          createtime: '1682612128',
          subscriberMsisdn: '237696689073',
          amount: 90,
          payToken: 'MP2304270429730CE5AC78D276A6',
          txnid: null,
          txnmode: '84d1uhuhiuhiliubi',
          inittxnmessage:
            'Vous avez saisi un montant superieur au montant maximum autorise',
          inittxnstatus: '60019',
          confirmtxnstatus: null,
          confirmtxnmessage: null,
          status: 'FAILED',
          notifUrl: '',
          description: '',
          channelUserMsisdn: '696431937',
        },
      },
    });
    const result = await exportedForMobileTesting.initiateMobilePayment({
      mobileOmVersion: mobileInitiateParams.orangeMoneyVersion,
      transactionId: mobileInitiateParams.transactionId,
      amount: mobileInitiateParams.amount,
      xAuthToken: mobileInitiateParams.xAuthToken,
      userPhoneNumber: mobileInitiateParams.userPhoneNumber,
      notifUrl: mobileInitiateParams.notifUrl,
      description: mobileInitiateParams.description,
      pinCode: mobileInitiateParams.pinCode,
      receiverPhoneNumber: mobileInitiateParams.receiverPhoneNumber,
      payToken: 'MP220807558VEF7A9C4F09AED',
      logger: logger,
      getAccessTokenFromCache: getAccessTokenFromCache,
      updateAccessTokenCache: updateAccessTokenCache,
      apiPassword: mobileInitiateParams.apiPassword,
      apiUserName: mobileInitiateParams.apiUserName,
    });
    expect('orangeMoneyError' in result && result.orangeMoneyError).toEqual(
      OrangeMoneyErrorType.invalidPaymentAmount
    );
  });

  it('Initialization Successful', async () => {
    jest.spyOn(requests, 'postRequest').mockResolvedValue({
      status: 200,
      data: {
        message: 'Payment request successfully initiated',
        data: {
          id: 75742131,
          createtime: '1682612128',
          subscriberMsisdn: '237696689073',
          amount: 90,
          payToken: 'MP2304270429730CE5AC78D276A6',
          txnid: null,
          txnmode: '84d1uhuhiuhiliubi',
          inittxnmessage:
            'Vous avez saisi un montant superieur au montant maximum autorise',
          inittxnstatus: '60019',
          confirmtxnstatus: null,
          confirmtxnmessage: null,
          status: 'PENDING',
          notifUrl: '',
          description: '',
          channelUserMsisdn: '696431937',
        },
      },
    });
    const result = await exportedForMobileTesting.initiateMobilePayment({
      mobileOmVersion: mobileInitiateParams.orangeMoneyVersion,
      transactionId: mobileInitiateParams.transactionId,
      amount: mobileInitiateParams.amount,
      xAuthToken: mobileInitiateParams.xAuthToken,
      userPhoneNumber: mobileInitiateParams.userPhoneNumber,
      notifUrl: mobileInitiateParams.notifUrl,
      description: mobileInitiateParams.description,
      pinCode: mobileInitiateParams.pinCode,
      receiverPhoneNumber: mobileInitiateParams.receiverPhoneNumber,
      payToken: 'MP220807558VEF7A9C4F09AED',
      logger: logger,
      getAccessTokenFromCache: getAccessTokenFromCache,
      updateAccessTokenCache: updateAccessTokenCache,
      apiPassword: mobileInitiateParams.apiPassword,
      apiUserName: mobileInitiateParams.apiUserName,
    });
    expect('status' in result && result.status).toEqual(
      OrangePaymentStatus.PENDING_PAYMENT
    );
  });
});
describe('Test the status verification', () => {
  let accessToken: string | undefined;
  const getAccessTokenFromCache = async (): Promise<
    | { accessToken: string; expirationTimeInUtc: string | null | undefined }
    | undefined
  > => {
    return accessToken === undefined
      ? undefined
      : {
          accessToken: accessToken,
          expirationTimeInUtc: fakeNow.toISOString(),
        };
  };
  const updateAccessTokenCache = async (newAccessToken: string) => {
    accessToken = newAccessToken;
    return true;
  };
  const mobilePaymentParamForCheckStatus: MobileParamsForCheckStatus = {
    mobileOmVersion: 'v3',
    xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
    payToken: 'MP220807558VEF7A9C4F09AED',
    apiUserName: 'secret',
    apiPassword: 'secret',
  };
  it('Return the payment status', async () => {
    jest.spyOn(requests, 'postRequest').mockResolvedValue({
      status: 200,
      data: {
        access_token: '02c96d76-f7dc-357c-af8d-9e3ff95b87b6',
        scope: 'am_application_scope default',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    });
    jest.spyOn(requests, 'getRequest').mockResolvedValue({
      status: 200,
      data: {
        message: 'Transaction retrieved successfully',
        data: {
          id: 74581010,
          createtime: '1682001669',
          subscriberMsisdn: '655637944',
          amount: 1100,
          payToken: 'MP23042031A1724A914DF0382D01',
          txnid: 'MP230420.1541.C39196',
          txnmode: 'zSapffVPWccheVZQRtvG',
          inittxnmessage:
            'Paiement e la clientele done.The devrez confirmer le paiement en saisissant son code PIN et vous recevrez alors un SMS. Merci dutiliser des services Orange Money.',
          inittxnstatus: '200',
          confirmtxnstatus: '200',
          confirmtxnmessage:
            'Paiement de SPREELOOP reussi par 655637944 PEKE. ID transaction:MP230420.1541.C39196, Montant:1100 FCFA. Solde: 55.81 FCFA.',
          status: 'SUCCESSFULL',
          notifUrl:
            'https://europe-west1-place-prod.cloudfunctions.net/api-1/payment/orange_money/live/zSapffVPWccheVZQRtvG',
          description: 'Commande',
          channelUserMsisdn: '696431937',
        },
      },
    });
    const result = await exportedForMobileTesting.checkPaymentStatus({
      mobileOmVersion: mobilePaymentParamForCheckStatus.mobileOmVersion,
      xAuthToken: mobilePaymentParamForCheckStatus.xAuthToken,
      paytoken: mobilePaymentParamForCheckStatus.payToken,
      apiUserName: mobilePaymentParamForCheckStatus.apiUserName,
      apiPassword: mobilePaymentParamForCheckStatus.apiPassword,
      logger: logger,
      getAccessTokenFromCache: getAccessTokenFromCache,
      updateAccessTokenCache: updateAccessTokenCache,
    });
    expect('status' in result && result.status).toBe(
      OrangePaymentStatus.SUCCESSFULL_MOBILE_PAYMENT
    );
  });
});
