import * as requests from '../../utils/https';
import { OrangeMoneyPaymentStatus } from '../utils/constants';

import { TargetEnvironment } from '../../utils/utils';
import { GetOrangeMoneyPaymentRequest } from '../utils/request_model';
import { getPaymentStatus } from './get_payment_status';

const logger = console;

describe('Test the status verification', () => {
  const mobilePaymentParamForCheckStatus: GetOrangeMoneyPaymentRequest = {
    accessToken: '1e23bee1-37dc-3015-a7d6-cb70e566bd64',
    payToken: 'MP220807558VEF7A9C4F09AED',
  };
  it('Return the payment status', async () => {
    jest.spyOn(requests, 'getRequest').mockResolvedValue({
      response: {
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
      },
    });
    const result = await getPaymentStatus({
      mobileStatusVerificationParams: mobilePaymentParamForCheckStatus,
      paymentServiceConfig: {
        targetEnvironment: TargetEnvironment.fake,
        xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
        apiUserName: 'secret',
        apiPassword: 'secret',
        logger: logger,
      },
      endPoint: 'https://api.paytoken.co',
    });
    expect(result.data?.status).toBe(
      OrangeMoneyPaymentStatus.SUCCESSFULL_MOBILE_PAYMENT
    );
  });
  it('Return the error response', async () => {
    jest.spyOn(requests, 'getRequest').mockResolvedValue({
      error: {
        responseError: {
          data: [Object],
          status: 401,
          statusText: 'Unauthorized',
          headers: null,
        },
      },
    });
    const result = await getPaymentStatus({
      mobileStatusVerificationParams: mobilePaymentParamForCheckStatus,
      paymentServiceConfig: {
        targetEnvironment: TargetEnvironment.fake,
        xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
        apiUserName: 'secret',
        apiPassword: 'secret',
        logger: logger,
      },
      endPoint: 'https://api.paytoken.co',
    });
    expect(result.error).toBeDefined();
  });
});
