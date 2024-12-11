import { TargetEnvironment } from "../../utils/constants";
import { getAccessToken } from "../operations/get_access_token";
import { getPaymentStatus } from "../operations/get_payment_status";
import { initializeMtnMomoPayment as initMomoPayment } from "../operations/initialize_om_payment";
import { MtnMomoInterface } from "../payments";
import { Routes } from "../routes/routes";
import {
  GetAccessTokenResponse,
  GetMtnMomoPaymentRequest,
  GetMtnMomoPaymentResponse,
  InitializeMtnMomoPaymentRequest,
  InitializeMtnMomoResponse,
  MtnMomoPaymentParams,
} from "../utils/request_model";

/**
 * Implements the MTN MOMO live payment.
 */
export class MtnMomoPaymentLive implements MtnMomoInterface {
  protected readonly config: MtnMomoPaymentParams;
  protected readonly route: Routes;

  /**
   * Creates a new instance of the MtnMomoPaymentLive class.
   *
   * @param {MtnMomoPaymentParams} config - The configuration for the payment instance.
   */
  constructor(config: MtnMomoPaymentParams) {
    this.config = config;
    this.route = new Routes(TargetEnvironment.prod);
  }

  /**
   * Gets an access token.
   *
   * @return {Promise<GetAccessTokenResponse>} the access token response
   */
  async getAccessToken(): Promise<GetAccessTokenResponse> {
    const response = await getAccessToken(
      this.config,
      this.route.accessToken()
    );
    return response;
  }

  /**
   * Initializes the MTN MOMO payment.
   *
   * @param {InitializeMtnMomoPaymentRequest} mobileInitParams - Parameters for mobile initialization
   * @return {Promise<InitializeMtnMomoResponse>} A promise that resolves with the mobile payment initialization response
   */
  async initializeMtnMomoPayment(
    mobileInitParams: InitializeMtnMomoPaymentRequest,
    accessToken: string
  ): Promise<InitializeMtnMomoResponse> {
    return initMomoPayment({
      mobileInitParams,
      paymentConfig: this.config,
      endPoint: this.route.initPayment(),
      accessToken: accessToken,
    });
  }

  /**
   * Gets the status of a payment.
   *
   * @param {GetMtnMomoPaymentRequest} checkStatusParams - The parameters for checking the status.
   * @return {Promise<GetMtnMomoPaymentResponse>} The response containing the payment status.
   */
  async getMtnMomoPaymentStatus(
    checkStatusParams: GetMtnMomoPaymentRequest,
    accessToken: string
  ): Promise<GetMtnMomoPaymentResponse> {
    return getPaymentStatus({
      mobileStatusVerificationParams: checkStatusParams,
      paymentServiceConfig: this.config,
      endPoint: this.route.paymentStatus({
        referenceId: checkStatusParams.referenceId,
      }),
      accessToken: accessToken,
    });
  }
}
