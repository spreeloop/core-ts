import { getAccessToken } from '../operations/get_access_token';
import { getPayToken } from '../operations/get_pay_token';
import { getPaymentStatus } from '../operations/get_payment_status';
import { OrangeMoneyPaymentConfigs } from '../utils/joi_schema';

import { initializeOmPayment } from '../operations/initialize_om_payment';
import { OrangeMoneyPaymentInterface } from '../payments';
import { Routes } from '../routes/routes';
import {
  GetAccessTokenResponse,
  GetOrangeMoneyPaymentRequest,
  GetOrangeMoneyPaymentResponse,
  GetPayTokenResponse,
  InitializeOrangeMoneyRequest,
  InitializeOrangeMoneyResponse,
} from '../utils/request_model';

/**
 * Implements the orange money live payment.
 */
export class OrangeMoneyPaymentLive implements OrangeMoneyPaymentInterface {
  protected readonly config: OrangeMoneyPaymentConfigs;
  protected readonly route: Routes;

  /**
   * Creates a new instance of the PaymentConfig class.
   *
   * @param {PaymentConfig} config - The configuration for the PaymentConfig instance.
   */
  constructor(config: OrangeMoneyPaymentConfigs) {
    this.config = config;
    this.route = new Routes(config.orangeMoneyVersion);
  }

  /**
   * Gets a pay token using the provided access token.
   *
   * @param {string} accessToken - The access token used to create the pay token.
   * @return {Promise<GetPayTokenResponse>} A promise that resolves to the pay token response.
   */
  async getPayToken(accessToken: string): Promise<GetPayTokenResponse> {
    return getPayToken(this.config, accessToken, this.route.mobilePayToken());
  }

  /**
   * Gets an access token.
   *
   * @return {Promise<GetAccessTokenResponse>} the access token response
   */
  async getAccessToken(): Promise<GetAccessTokenResponse> {
    return getAccessToken(this.config, this.route.mobileAccessToken());
  }

  /**
   * Initializes the orange money payment.
   *
   * @param {InitializeOrangeMoneyRequest} mobileInitParams - Parameters for mobile initialization
   * @return {Promise<InitializeOrangeMoneyResponse>} A promise that resolves with the mobile payment initialization response
   */
  async initializeOrangeMoneyPayment(
    mobileInitParams: InitializeOrangeMoneyRequest
  ): Promise<InitializeOrangeMoneyResponse> {
    return initializeOmPayment({
      paymentConfig: this.config,
      mobileInitParams: mobileInitParams,
      endPoint: this.route.mobileInitPayment(),
    });
  }

  /**
   * Gets the status of a payment.
   *
   * @param {GetOrangeMoneyPaymentRequest} checkStatusParams - The parameters for checking the status.
   * @return {Promise<GetOrangeMoneyPaymentResponse>} The response containing the payment status.
   */
  async getOrangeMoneyPaymentStatus(
    checkStatusParams: GetOrangeMoneyPaymentRequest
  ): Promise<GetOrangeMoneyPaymentResponse> {
    return getPaymentStatus({
      paymentServiceConfig: this.config,
      mobileStatusVerificationParams: checkStatusParams,
      endPoint: this.route.mobilePaymentStatus({
        payToken: checkStatusParams.payToken,
      }),
    });
  }
}
