import { TargetEnvironment } from '../utils/utils';
import { OrangeMoneyPaymentFake } from './implementations/fake';
import { OrangeMoneyPaymentLive } from './implementations/live';
import { OrangeMoneyPaymentConfigs } from './utils/joi_schema';
import {
  GetAccessTokenResponse,
  GetOrangeMoneyPaymentRequest,
  GetOrangeMoneyPaymentResponse,
  GetPayTokenResponse,
  InitializeOrangeMoneyRequest,
  InitializeOrangeMoneyResponse,
} from './utils/request_model';

export interface OrangeMoneyPaymentInterface {
  /**
   * Gets the pay token token.
   * @param {String} accessToken The access token for authorize the request.
   * @returns {Promise<GetPayTokenResponse>} The promise that resolves to the pay token response.
   */
  getPayToken(accessToken: string): Promise<GetPayTokenResponse>;

  /**
   * Gets the access token token.
   */
  getAccessToken(): Promise<GetAccessTokenResponse>;

  /**
   * Initializes the orange money payment.
   *
   * @param {String} mobileInitParams.description the payment description.
   * @param {String} mobileInitParams.subscriberNumber The phone number of the user making the payment.
   * @param {String} mobileInitParams.channelUserNumber The phone number of the user receiving the payment.
   * @param {String} mobileInitParams.transactionId Unique identifier of the customer transaction.
   * @param {String} mobileInitParams.amount The amount of the transaction.
   * @param {String} mobileInitParams.pinCode The Pin code of the ChannelUser.
   * @param {String} mobileInitParams.notifUrl An http endpoint able to receive a post request.
   * @param {String} mobileInitParams.payToken A payToken value useful to make payment
   * and track the status of payment.
   * @param {String} mobileInitParams.accessToken The access token for authorize the request.
   * @returns {Promise<InitializeOrangeMoneyResponse>} The promise that resolves to the mobile payment initialization response.
   **/
  initializeOrangeMoneyPayment(
    params: InitializeOrangeMoneyRequest
  ): Promise<InitializeOrangeMoneyResponse>;

  /**
   * Gets The orange money payment status.
   * @param {String} checkStatusParams.payToken unique identifier used to obtain payment status.
   * @param {String} checkStatusParams.accessToken The access token for authorize the request.
   * @returns {Promise<GetOrangeMoneyPaymentResponse>} The promise that resolves to the mobile payment status response.
   */
  getOrangeMoneyPaymentStatus(
    params: GetOrangeMoneyPaymentRequest
  ): Promise<GetOrangeMoneyPaymentResponse>;
}

/**
 *  Creates a orange money payment.
 */
export class OrangeMoneyPayment {
  /**
   * Create a new payment using the provided configuration.
   *
   * @param {OrangeMoneyPaymentParams} config - The payment configuration.
   *  - {TargetEnvironment} config.targetEnvironment the target environment.
   *  - {string} config.apiUserName channelUser api username.
   *  - {string} config.apiPassword channelUser api password.
   *  - {string} config.xAuthToken the x-auth-token.
   *  - {string} [mobileInitParams.omVersion] the mobile orange money version apply for payment request.The default orange money version
   *        is 1.0.2: for more information: https://apiw.orange.cm/omcoreapis/1.0.2/mp/pay.
   *  - {String} config.targetEnvironment the target environment.
   * @return {OrangeMoneyPaymentInterface} The created payment.
   */
  static createPayment(
    config: OrangeMoneyPaymentConfigs
  ): OrangeMoneyPaymentInterface {
    switch (config.targetEnvironment) {
      case TargetEnvironment.prod:
        return new OrangeMoneyPaymentLive(config);
      case TargetEnvironment.fake:
        return new OrangeMoneyPaymentFake();
      default:
        return new OrangeMoneyPaymentLive(config);
    }
  }
}
