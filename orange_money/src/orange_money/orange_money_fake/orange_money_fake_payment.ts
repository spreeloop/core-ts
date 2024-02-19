import { OrangeMoneyErrorType } from '../../constants';
import { LoggerInterface } from '../../utils/logging_interface';
import {
  MobilePaymentCheckStatusResponse,
  MobilePaymentInitializationResponse,
} from '../../utils/requests_responses';
import {
  MobileInitializationParams,
  MobileParamsForCheckStatus,
} from '../../utils/resquest_params';
import { OrangeMoneyFunctions } from '../orange_money';
import {
  mobileCheckPaymentSuccess,
  mobileInitializationSuccess,
} from './fake_result';

/**
 * Implement the orange money fake payment.
 */
export class OrangeMoneyPaymentFake implements OrangeMoneyFunctions {
  /**
   * Constructs a new OrangeMoneyPaymentFake Payment.
   * @param {LoggerInterface} logger
   */
  constructor(public readonly logger: LoggerInterface) {}

  /**
   * Gets The mobile orange money payment status.
   * @param {MobileParamsForCheckStatus} checkStatusParams the necessary parameters to get the mobile payment status.
   * @return {string} the response who contains the payment state.
   */
  async checkMobilePaymentStatus(
    checkStatusParams: MobileParamsForCheckStatus
  ): Promise<MobilePaymentCheckStatusResponse> {
    const apiPassword = checkStatusParams.apiPassword;
    const apiUserName = checkStatusParams.apiUserName;
    const xAuthToken = checkStatusParams.xAuthToken;
    const paytoken = checkStatusParams.payToken;

    if (!(apiPassword && apiUserName && xAuthToken && paytoken)) {
      this.logger.error(
        ' Failed to check the status. Invalid data provided: ',
        JSON.stringify(checkStatusParams)
      );

      return { orangeMoneyError: OrangeMoneyErrorType.invalidData };
    }

    return { status: mobileCheckPaymentSuccess };
  }

  /**
   * Enter point to initiate the orange money mobile payment.
   * @param {MobileInitializationParams} mobileInitParams the necessary parameters to initialize the mobile payment.
   * @return {MobilePaymentInitializationResponse} the response of initialization.
   *
   **/
  async initializeMobilePayment(
    mobileInitParams: MobileInitializationParams
  ): Promise<MobilePaymentInitializationResponse> {
    const apiPassword = mobileInitParams.apiPassword;
    const apiUserName = mobileInitParams.apiUserName;
    const xAuthToken = mobileInitParams.xAuthToken;
    const transactionId = mobileInitParams.transactionId;
    const amount = mobileInitParams.amount;
    const userPhoneNumber = mobileInitParams.userPhoneNumber;
    const notifUrl = mobileInitParams.notifUrl;
    const pinCode = mobileInitParams.pinCode;
    const receiverPhoneNumber = mobileInitParams.receiverPhoneNumber;
    if (
      !(
        apiPassword &&
        apiUserName &&
        xAuthToken &&
        amount &&
        transactionId &&
        userPhoneNumber &&
        notifUrl &&
        pinCode &&
        receiverPhoneNumber
      )
    ) {
      this.logger.error(
        'Initialization failed. Invalid data provided. ',
        JSON.stringify(mobileInitParams)
      );

      return {
        orangeMoneyError: OrangeMoneyErrorType.invalidData,
      };
    }
    return mobileInitializationSuccess;
  }
}
