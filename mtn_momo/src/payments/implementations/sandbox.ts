import { Routes } from "../routes/routes";
import {
  GetAccessTokenResponse,
  GetMtnMomoPaymentRequest,
  GetMtnMomoPaymentResponse,
  InitializeMtnMomoPaymentRequest,
  InitializeMtnMomoResponse,
  MtnMomoPaymentConfigs,
} from "../utils/request_model";
import { TargetEnvironment } from "../../utils/constants";
import { getAccessToken } from "../operations/get_access_token";
import { initializeMtnMomoPayment } from "../operations/initialize_om_payment";
import { getPaymentStatus } from "../operations/get_payment_status";
import { MtnMomoInterface } from "../payments";

/**
 * Implements the MTN MOMO sandbox payment for testing in sandbox environment.
 */
export class MtnMomoPaymentSandbox implements MtnMomoInterface {
  protected readonly config: MtnMomoPaymentConfigs;
  protected readonly route: Routes;

  /**
   * Creates a new instance of the MtnMomoPaymentSandbox class.
   *
   * @param {MtnMomoPaymentConfigs} config - The configuration for the payment instance.
   */
  constructor(config: MtnMomoPaymentConfigs) {
    this.config = config;
    this.route = new Routes(TargetEnvironment.sandbox);
  }

  /**
   * Gets an access token from the sandbox environment.
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
   * Initializes the MTN MOMO payment in sandbox environment.
   *
   * @param {InitializeMtnMomoPaymentRequest} mobileInitParams - Parameters for mobile initialization
   * @param {string} accessToken - The access token for the request
   * @return {Promise<InitializeMtnMomoResponse>} A promise that resolves with the mobile payment initialization response
   */
  async initializeMtnMomoPayment(
    mobileInitParams: InitializeMtnMomoPaymentRequest,
    accessToken: string
  ): Promise<InitializeMtnMomoResponse> {
    return initializeMtnMomoPayment({
      mobileInitParams,
      paymentConfig: this.config,
      endPoint: this.route.initPayment(),
      accessToken: accessToken,
    });
  }

  /**
   * Gets the status of a payment in sandbox environment.
   *
   * @param {GetMtnMomoPaymentRequest} request - The parameters for checking the status
   * @param {string} accessToken - The access token for the request
   * @return {Promise<GetMtnMomoPaymentResponse>} The response containing the payment status
   */
  async getMtnMomoPaymentStatus(
    request: GetMtnMomoPaymentRequest,
    accessToken: string
  ): Promise<GetMtnMomoPaymentResponse> {
    return getPaymentStatus({
      mobileStatusVerificationParams: request,
      paymentServiceConfig: this.config,
      endPoint: this.route.paymentStatus({
        referenceId: request.referenceId,
      }),
      accessToken: accessToken,
    });
  }
}
