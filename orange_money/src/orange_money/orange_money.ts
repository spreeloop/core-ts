import { Logger } from '../../../logging';
import { TargetEnvironment } from '../constants';
import { LoggerInterface } from '../utils/logging_interface';
import {
  MobilePaymentCheckStatusResponse,
  MobilePaymentInitializationResponse,
} from '../utils/requests_responses';
import {
  MobileInitializationParams,
  MobileParamsForCheckStatus,
} from '../utils/resquest_params';
import { OrangeMoneyPaymentFake } from './orange_money_fake/orange_money_fake_payment';
import { OrangeMoneyPaymentLive } from './orange_money_live/orange_money_live_payment';

export interface OrangeMoneyFunctions {
  /**
   * Enter point to initiate the mobile orange money payment.
   *
   * @param {String} mobileInitParams.mobileEndPointURL the http end point on which the request will be sent, example https://apiw.orange.cm.
   * @param {String} mobileInitParams.apiUserName channelUser api username.
   * @param {String} mobileInitParams.apiPassword channelUser api password.
   * @param {String} mobileInitParams.xAuthToken the x-auth-token.
   * @param {String} mobileInitParams.description the payment description.
   * @param {String} mobileInitParams.userPhoneNumber The phone number of the user making the payment.
   * @param {String} mobileInitParams.receiverPhoneNumber The phone number of the user receiving the payment.
   * @param {String} mobileInitParams.transactionId Unique identifier of the customer transaction.
   * @param {String} mobileInitParams.amount The amount of the transaction.
   * @param {String} mobileInitParams.pinCode The Pin code of the ChannelUser.
   * @param {String} mobileInitParams.notifUrl An http endpoint able to receive a post request.
   * @param {String} mobileInitParams.omVersion the mobile orange money version apply for payment request.The default orange money version
   *        is 1.0.2: https://apiw.orange.cm/omcoreapis/1.0.2/mp/pay
   * @param {() => Promise<string | undefined>} mobileInitParams.getAccessTokenFromCache function to get the access token.
   * @param {(string) => Promise<boolean>} mobileInitParams.updateAccessTokenCache function to set the access token.
   **/
  initializeMobilePayment(
    mobileInitParams: MobileInitializationParams
  ): Promise<MobilePaymentInitializationResponse>;

  /**
   * Gets The orange mobile money payment status.
   * NB: much of this information has been sent to you by the orange money service.
   * @param {String}  checkStatusParams.statusEndpointUrl the http end point on which the request will be sent,
   * example: https://apiw.orange.cm.
   * @param {String} checkStatusParams.payToken unique identifier used to obtain payment status.
   * @param {String} checkStatusParams.xAuthToken The x-auth-token.
   * @param {String} checkStatusParams.apiUserName channelUser api username.
   * @param {String} checkStatusParams.apiPassword channelUser api password.
   * @param {String} checkStatusParams.mobileOmVersion The mobile orange money version apply for
   * payment request.The default orange money version used is 1.0.2. channelUser api password.
   */
  checkMobilePaymentStatus(
    checkStatusParams: MobileParamsForCheckStatus
  ): Promise<MobilePaymentCheckStatusResponse>;
}

/**
 *  Creates a orange money payment.
 */
export class OrangeMoneyPayment {
  /**
   * Creates a payment instance based on the given OrangeMoney payment type.
   *
   * @param {TargetEnvironment} targetEnvironment - The type of OrangeMoney payment.
   * @param {LoggerInterface} logger - The logger instance. Defaults to a new Logger object.
   * @param {Function} getAccessTokenFromCache - The function to get the access token from cache.
   * @param {Function} updateAccessTokenCache - The function to update the cache access token.
   * @return {OrangeMoneyFunctions} The created OrangeMoneyFunctions instance.
   */
  static createPayment(
    targetEnvironment: TargetEnvironment,
    logger: LoggerInterface = new Logger(),
    getAccessTokenFromCache: () => Promise<
      { accessToken: string; expirationTimeInUtc?: string | null } | undefined
    >,
    updateAccessTokenCache: (
      accessToken: string,
      accessTokenExpirationTimeInUtc: string
    ) => Promise<boolean>
  ): OrangeMoneyFunctions {
    switch (targetEnvironment) {
      case TargetEnvironment.prod:
        return new OrangeMoneyPaymentLive(
          logger,
          getAccessTokenFromCache,
          updateAccessTokenCache
        );
      case TargetEnvironment.fake:
        return new OrangeMoneyPaymentFake(logger);
      default:
        return new OrangeMoneyPaymentLive(
          logger,
          getAccessTokenFromCache,
          updateAccessTokenCache
        );
    }
  }
}
