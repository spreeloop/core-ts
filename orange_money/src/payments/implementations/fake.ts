import { OrangeMoneyPaymentStatus } from '../utils/constants';
import {
  AccessTokenRequestResponse,
  PayTokenRequestResponse,
} from '../utils/joi_schema';
import {
  GetAccessTokenResponse,
  GetOrangeMoneyPaymentRequest,
  GetOrangeMoneyPaymentResponse,
  InitializeOrangeMoneyRequest,
  InitializeOrangeMoneyResponse,
  GetPayTokenResponse,
} from '../utils/request_model';
import { OrangeMoneyPaymentInterface } from '../payments';

const payTokenResponse: PayTokenRequestResponse = {
  message: 'success',
  data: {
    payToken: 'MP220807558VEF7A9C4F09AED',
  },
};

const mobileAccessTokenResponse: AccessTokenRequestResponse = {
  access_token: '1e23bee1-37dc-3015-a7d6-cb70e566bd64',
  token_type: 'bearer',
  expires_in: 3600,
  scope: 'read write',
};

/**
 * Implement the orange money fake payment.
 */
export class OrangeMoneyPaymentFake implements OrangeMoneyPaymentInterface {
  /**
   * Generates a pay token using the provided access token.
   *
   * @return {Promise<GetPayTokenResponse>} A promise that resolves to the pay token response.
   */
  async getPayToken(): Promise<GetPayTokenResponse> {
    return Promise.resolve({
      raw: payTokenResponse,
      data: 'MP220806C74C8F5787A9C4F79AED',
    });
  }

  /**
   * Generates an access token.
   *
   * @return {Promise<GetAccessTokenResponse>} the access token response
   */
  async getAccessToken(): Promise<GetAccessTokenResponse> {
    return Promise.resolve({
      raw: mobileAccessTokenResponse,
      data: '1e23bee1-37dc-3015-a7d6-cb70e566bd64',
    });
  }
  /**
   * Retrieves The orange money payment status.
   * @param {MobileParamsForCheckStatus} checkStatusParams the necessary parameters to get the mobile payment status.
   * @return {GetOrangeMoneyPaymentResponse} the response who contains the payment state.
   */
  async getOrangeMoneyPaymentStatus(
    checkStatusParams: GetOrangeMoneyPaymentRequest
  ): Promise<GetOrangeMoneyPaymentResponse> {
    return Promise.resolve({
      raw: {
        message: 'Transaction retrieved successfully',
        data: {
          id: 74581010,
          createtime: '1682001669',
          subscriberMsisdn: '655637944',
          amount: 1100,
          payToken: checkStatusParams.payToken,
          txnid: 'MP230420.1541.C39196',
          txnmode: 'zSapffVPWccheVZQRtvG',
          inittxnmessage:
            'Paiement e la clientele done.The devrez confirmer le paiement en saisissant son code PIN et vous recevrez alors un SMS. Merci dutiliser des services Orange Money.',
          inittxnstatus: '200',
          confirmtxnstatus: '200',
          confirmtxnmessage:
            'Paiement de SPREELOOP reussi par 655637944 PEKE. ID transaction:MP230420.1541.C39196, Montant:1100 FCFA. Solde: 55.81 FCFA.',
          status: OrangeMoneyPaymentStatus.SUCCESSFULL_MOBILE_PAYMENT,
          notifUrl:
            'https://europe-west1-place-prod.cloudfunctions.net/api-1/payment/orange_money/live/zSapffVPWccheVZQRtvG',
          description: 'Commande',
          channelUserMsisdn: '696431937',
        },
      },
      data: {
        status: OrangeMoneyPaymentStatus.SUCCESSFULL_MOBILE_PAYMENT,
      },
    });
  }

  /**
   * Initiates the orange money payment.
   * @param {InitializeOrangeMoneyRequest} mobileInitParams the necessary parameters to initialize the mobile payment.
   * @return {InitializeOrangeMoneyResponse} the response of initialization.
   *
   **/
  async initializeOrangeMoneyPayment(
    mobileInitParams: InitializeOrangeMoneyRequest
  ): Promise<InitializeOrangeMoneyResponse> {
    return Promise.resolve({
      raw: {
        message: 'Transaction retrieved successfully',
        data: {
          id: 74581010,
          createtime: '1682001669',
          subscriberMsisdn: '655637944',
          amount: 1100,
          payToken: mobileInitParams.payToken,
          txnid: 'MP230420.1541.C39196',
          txnmode: 'zSapffVPWccheVZQRtvG',
          inittxnmessage:
            'Paiement e la clientele done.The devrez confirmer le paiement en saisissant son code PIN et vous recevrez alors un SMS. Merci dutiliser des services Orange Money.',
          inittxnstatus: '200',
          confirmtxnstatus: '200',
          confirmtxnmessage:
            'Paiement de SPREELOOP reussi par 655637944 PEKE. ID transaction:MP230420.1541.C39196, Montant:1100 FCFA. Solde: 55.81 FCFA.',
          status: OrangeMoneyPaymentStatus.PENDING_PAYMENT,
          notifUrl:
            'https://europe-west1-place-prod.cloudfunctions.net/api-1/payment/orange_money/live/zSapffVPWccheVZQRtvG',
          description: 'Commande',
          channelUserMsisdn: '696431937',
        },
      },
      data: {
        payToken: mobileInitParams.payToken,
      },
    });
  }
}
