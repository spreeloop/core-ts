import * as requests from '../../utils/https';
import { ApiErrorType, OrangeMoneyPaymentStatus } from '../utils/constants';

import { TargetEnvironment } from '../../utils/utils';
import { InitializeOrangeMoneyRequest } from '../utils/request_model';
import { initializeOmPayment } from './initialize_om_payment';

const logger = console;

describe('Test the initialization of payment', () => {
  const mobileInitiateParams: InitializeOrangeMoneyRequest = {
    amount: 100,
    notifUrl: 'https://localhost',
    transactionId: '1',
    pinCode: '123',
    channelUserNumber: '698526541',
    subscriberNumber: '698526541',
    accessToken: '1e23bee1-37dc-3015-a7d6-cb70e566bd64',
    payToken: 'MP220807558VEF7A9C4F09AED',
  };

  it('Initialization failed cause of invalid channel number', async () => {
    jest.spyOn(requests, 'postRequest').mockImplementationOnce(() =>
      Promise.resolve({
        response: {
          status: 417,
          data: {
            message: '60019 :: Le solde du compte du payeur est insuffisant',
            data: {
              id: 75742131,
              createtime: '1682612128',
              subscriberMsisdn: '696689073',
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
        },
      })
    );
    const result = await initializeOmPayment({
      mobileInitParams: {
        transactionId: mobileInitiateParams.transactionId,
        amount: mobileInitiateParams.amount,
        subscriberNumber: mobileInitiateParams.subscriberNumber,
        notifUrl: mobileInitiateParams.notifUrl,
        description: mobileInitiateParams.description,
        pinCode: mobileInitiateParams.pinCode,
        channelUserNumber: '688526541',
        payToken: mobileInitiateParams.payToken,
        accessToken: mobileInitiateParams.accessToken,
      },
      paymentConfig: {
        orangeMoneyVersion: '1.2.0',
        apiPassword: 'secret',
        apiUserName: 'secret',
        xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
        targetEnvironment: TargetEnvironment.fake,
        logger: logger,
      },
      endPoint: 'https://api.paytoken.co',
    });
    expect(result.error).toEqual(ApiErrorType.failedToInitiateThePayment);
  });
  it('Initialization failed cause of insufficient balance', async () => {
    jest.spyOn(requests, 'postRequest').mockImplementationOnce(() =>
      Promise.resolve({
        response: {
          status: 417,
          data: {
            message: '60019 :: Le solde du compte du payeur est insuffisant',
            data: {
              id: 75742131,
              createtime: '1682612128',
              subscriberMsisdn: '696689073',
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
        },
      })
    );
    const result = await initializeOmPayment({
      mobileInitParams: {
        transactionId: mobileInitiateParams.transactionId,
        amount: mobileInitiateParams.amount,
        subscriberNumber: mobileInitiateParams.subscriberNumber,
        notifUrl: mobileInitiateParams.notifUrl,
        description: mobileInitiateParams.description,
        pinCode: mobileInitiateParams.pinCode,
        channelUserNumber: mobileInitiateParams.channelUserNumber,
        payToken: mobileInitiateParams.payToken,
        accessToken: mobileInitiateParams.accessToken,
      },
      paymentConfig: {
        orangeMoneyVersion: '1.2.0',
        apiPassword: 'secret',
        apiUserName: 'secret',
        xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
        targetEnvironment: TargetEnvironment.fake,
        logger: logger,
      },
      endPoint: 'https://api.paytoken.co',
    });
    expect(result.error).toEqual(ApiErrorType.insufficientFunds);
  });
  it('Initialization failed cause of account blocked ', async () => {
    jest.spyOn(requests, 'postRequest').mockImplementationOnce(() =>
      Promise.resolve({
        response: {
          status: 417,
          data: {
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
        },
      })
    );
    const result = await initializeOmPayment({
      mobileInitParams: {
        transactionId: mobileInitiateParams.transactionId,
        amount: mobileInitiateParams.amount,
        subscriberNumber: mobileInitiateParams.subscriberNumber,
        notifUrl: mobileInitiateParams.notifUrl,
        description: mobileInitiateParams.description,
        pinCode: mobileInitiateParams.pinCode,
        channelUserNumber: mobileInitiateParams.channelUserNumber,
        payToken: mobileInitiateParams.payToken,
        accessToken: mobileInitiateParams.accessToken,
      },
      paymentConfig: {
        orangeMoneyVersion: '1.2.0',
        apiPassword: 'secret',
        apiUserName: 'secret',
        xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
        targetEnvironment: TargetEnvironment.fake,
        logger: logger,
      },
      endPoint: 'https://api.paytoken.co',
    });
    expect(result.error).toEqual(ApiErrorType.accountLocked);
  });

  it('Initialization Successful', async () => {
    jest.spyOn(requests, 'postRequest').mockImplementationOnce(() =>
      Promise.resolve({
        response: {
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
        },
      })
    );
    const result = await initializeOmPayment({
      mobileInitParams: {
        transactionId: mobileInitiateParams.transactionId,
        amount: mobileInitiateParams.amount,
        subscriberNumber: mobileInitiateParams.subscriberNumber,
        notifUrl: mobileInitiateParams.notifUrl,
        description: mobileInitiateParams.description,
        pinCode: mobileInitiateParams.pinCode,
        channelUserNumber: mobileInitiateParams.channelUserNumber,
        payToken: mobileInitiateParams.payToken,
        accessToken: mobileInitiateParams.accessToken,
      },
      paymentConfig: {
        orangeMoneyVersion: '1.2.0',
        apiPassword: 'secret',
        apiUserName: 'secret',
        xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
        targetEnvironment: TargetEnvironment.fake,
        logger: logger,
      },
      endPoint: 'https://api.paytoken.co',
    });
    expect(result.data).toStrictEqual({
      payToken: 'MP220807558VEF7A9C4F09AED',
    });
  });

  describe('Timeout / network-error fallback — status verification', () => {
    const paymentConfig = {
      orangeMoneyVersion: '1.2.0',
      apiPassword: 'secret',
      apiUserName: 'secret',
      xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
      targetEnvironment: TargetEnvironment.fake,
      logger: logger,
    };

    // Simulates a pure network/timeout failure from /mp/pay (no HTTP response).
    const mockNetworkFailure = () =>
      jest.spyOn(requests, 'postRequest').mockResolvedValueOnce({
        error: { requestFailed: { headers: {}, data: null } },
      });

    // Simulates the real-world OM WSO2 gateway "Send timeout" (HTTP 500 with XML body).
    const mockHttpTimeoutFailure = () =>
      jest.spyOn(requests, 'postRequest').mockResolvedValueOnce({
        response: {
          status: 500,
          data: '<am:fault xmlns:am="http://wso2.org/apimanager"><am:code>101504</am:code><am:type>Status report</am:type><am:message>Runtime Error</am:message><am:description>Send timeout</am:description></am:fault>',
        },
        error: {
          responseError: {
            status: 500,
            statusText: 'Internal Server Error',
          },
        },
      });

    const mockStatusSuccess = (status: OrangeMoneyPaymentStatus) =>
      jest.spyOn(requests, 'getRequest').mockResolvedValueOnce({
        response: {
          status: 200,
          data: {
            message: 'Transaction retrieved successfully',
            data: {
              id: 75742131,
              payToken: mobileInitiateParams.payToken,
              status: status,
            },
          },
        },
      });

    const mockStatusFailure = () =>
      jest.spyOn(requests, 'getRequest').mockResolvedValueOnce({
        error: { requestFailed: { headers: {}, data: null } },
      });

    it('returns success when /mp/pay times out but status check returns SUCCESSFULL', async () => {
      mockNetworkFailure();
      mockStatusSuccess(OrangeMoneyPaymentStatus.SUCCESSFULL_MOBILE_PAYMENT);

      const result = await initializeOmPayment({
        mobileInitParams: mobileInitiateParams,
        paymentConfig,
        endPoint: 'https://api.paytoken.co',
      });

      expect(result.error).toBeUndefined();
      expect(result.data).toStrictEqual({
        payToken: mobileInitiateParams.payToken,
      });
    });

    it('returns success when /mp/pay times out but status check returns PENDING', async () => {
      mockNetworkFailure();
      mockStatusSuccess(OrangeMoneyPaymentStatus.PENDING_PAYMENT);

      const result = await initializeOmPayment({
        mobileInitParams: mobileInitiateParams,
        paymentConfig,
        endPoint: 'https://api.paytoken.co',
      });

      expect(result.error).toBeUndefined();
      expect(result.data).toStrictEqual({
        payToken: mobileInitiateParams.payToken,
      });
    });

    it('returns success with payToken when /mp/pay times out and status check returns FAILED', async () => {
      mockNetworkFailure();
      mockStatusSuccess(OrangeMoneyPaymentStatus.FAILED_PAYMENT);

      const result = await initializeOmPayment({
        mobileInitParams: mobileInitiateParams,
        paymentConfig,
        endPoint: 'https://api.paytoken.co',
      });

      // FAILED is now treated as a definitive status from OM — the payToken is
      // returned so the caller can inspect the actual status via getPaymentStatus.
      expect(result.error).toBeUndefined();
      expect(result.data).toStrictEqual({
        payToken: mobileInitiateParams.payToken,
      });
    });

    it('returns original /mp/pay error when /mp/pay times out and status check itself also fails', async () => {
      mockNetworkFailure();
      mockStatusFailure();

      const result = await initializeOmPayment({
        mobileInitParams: mobileInitiateParams,
        paymentConfig,
        endPoint: 'https://api.paytoken.co',
      });

      expect(result.error).toEqual(ApiErrorType.failedToInitiateThePayment);
      expect(result.data).toBeUndefined();
    });

    it('returns success when /mp/pay returns HTTP 500 timeout but status check returns SUCCESSFULL', async () => {
      mockHttpTimeoutFailure();
      mockStatusSuccess(OrangeMoneyPaymentStatus.SUCCESSFULL_MOBILE_PAYMENT);

      const result = await initializeOmPayment({
        mobileInitParams: mobileInitiateParams,
        paymentConfig,
        endPoint: 'https://api.paytoken.co',
      });

      expect(result.error).toBeUndefined();
      expect(result.data).toStrictEqual({
        payToken: mobileInitiateParams.payToken,
      });
    });

    it('returns original /mp/pay error when /mp/pay returns HTTP 500 timeout and status check also fails', async () => {
      mockHttpTimeoutFailure();
      mockStatusFailure();

      const result = await initializeOmPayment({
        mobileInitParams: mobileInitiateParams,
        paymentConfig,
        endPoint: 'https://api.paytoken.co',
      });

      expect(result.error).toEqual(ApiErrorType.failedToInitiateThePayment);
      expect(result.data).toBeUndefined();
    });
  });
});
