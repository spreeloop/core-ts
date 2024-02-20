import * as requests from '../../utils/https';
import { ApiErrorType } from '../utils/constants';

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
});
