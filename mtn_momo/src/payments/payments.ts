import { TargetEnvironment } from "../utils/constants";
import { MtnMomoPaymentFake } from "./implementations/fake";
import { MtnMomoPaymentLive } from "./implementations/live";
import { MtnMomoPaymentSandbox } from "./implementations/sandbox";
import {
  GetAccessTokenResponse,
  GetMtnMomoPaymentRequest,
  GetMtnMomoPaymentResponse,
  InitializeMtnMomoPaymentRequest,
  InitializeMtnMomoResponse,
  MtnMomoPaymentConfigs,
} from "./utils/request_model";

/**
 * Interface for MTN MOMO payment operations
 */
export interface MtnMomoInterface {
  /**
   * Gets the access token for authorization.
   * @returns {Promise<GetAccessTokenResponse>} The promise that resolves to the access token response.
   */
  getAccessToken(): Promise<GetAccessTokenResponse>;

  /**
   * Initializes the MTN MOMO payment.
   *
   * @param {InitializeMtnMomoPaymentRequest} mobileInitParams - The payment initialization parameters
   * @param {string} accessToken - The access token for authorization
   * @returns {Promise<InitializeMtnMomoResponse>} The promise that resolves to the payment initialization response
   */
  initializeMtnMomoPayment(
    mobileInitParams: InitializeMtnMomoPaymentRequest,
    accessToken: string
  ): Promise<InitializeMtnMomoResponse>;

  /**
   * Gets the MTN MOMO payment status.
   * 
   * @param {GetMtnMomoPaymentRequest} request - The payment status request parameters
   * @param {string} accessToken - The access token for authorization
   * @returns {Promise<GetMtnMomoPaymentResponse>} The promise that resolves to the payment status response
   */
  getMtnMomoPaymentStatus(
    request: GetMtnMomoPaymentRequest,
    accessToken: string
  ): Promise<GetMtnMomoPaymentResponse>;
}

/**
 * Creates an MTN MOMO payment instance based on the target environment.
 */
export class MtnMomoPayment {
  /**
   * Creates a new payment instance using the provided configuration.
   *
   * @param {MtnMomoPaymentConfigs} config - The payment configuration
   * @returns {MtnMomoInterface} The created payment instance
   */
  static createPayment(config: MtnMomoPaymentConfigs): MtnMomoInterface {
    switch (config.targetEnvironment) {
      case TargetEnvironment.prod:
        return new MtnMomoPaymentLive(config);
      case TargetEnvironment.sandbox:
        return new MtnMomoPaymentSandbox(config);
      case TargetEnvironment.fake:
        return new MtnMomoPaymentFake(config);
      default:
        throw new Error(
          `Invalid target environment: ${config.targetEnvironment}`
        );
    }
  }
}
