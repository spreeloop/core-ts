import { ApiErrorType, MtnMomoPaymentStatus } from "../utils/constants";
import { Routes } from "../routes/routes";
import {
  GetAccessTokenResponse,
  GetMtnMomoPaymentRequest,
  GetMtnMomoPaymentResponse,
  InitializeMtnMomoPaymentRequest,
  InitializeMtnMomoResponse,
  MtnMomoPaymentConfigs,
} from "../utils/request_model";
import { MtnMomoInterface } from "../payments";

/**
 * Implements the MTN MOMO fake payment for testing purposes.
 */
export class MtnMomoPaymentFake implements MtnMomoInterface {
  protected readonly config: MtnMomoPaymentConfigs;
  protected readonly route: Routes;

  /**
   * Creates a new instance of the MtnMomoPaymentFake class.
   *
   * @param {MtnMomoPaymentConfigs} config - The configuration for the payment instance.
   */
  constructor(config: MtnMomoPaymentConfigs) {
    this.config = config;
    this.route = new Routes();
  }

  /**
   * Gets a fake access token.
   *
   * @return {Promise<GetAccessTokenResponse>} the access token response
   */
  async getAccessToken(): Promise<GetAccessTokenResponse> {
    return {
      data: "fake-access-token",
      raw: {
        access_token: "fake-access-token",
        expires_in: 3600,
        token_type: "Bearer",
        scope: "fake-scope",
      },
    };
  }

  /**
   * Initializes the MTN MOMO payment in fake mode.
   *
   * @param {InitializeMtnMomoPaymentRequest} mobileInitParams - Parameters for mobile initialization
   * @param {string} accessToken - The access token for the request
   * @return {Promise<InitializeMtnMomoResponse>} A promise that resolves with the mobile payment initialization response
   */
  async initializeMtnMomoPayment(
    request: InitializeMtnMomoPaymentRequest,
    accessToken: string
  ): Promise<InitializeMtnMomoResponse> {
    const ocpApimSubscription = this.config.ocpApimSubscriptionKey;
    const amount = request.amount;
    const xReferenceId = request.xReferenceId;
    const externalId = request.externalId;
    const userNumber = request.userPhoneNumber;
    const apiKey = this.config.apiKey;
    const apiUserKey = this.config.apiUserKey;

    if (
      !(
        ocpApimSubscription &&
        amount &&
        xReferenceId &&
        userNumber &&
        externalId &&
        apiKey &&
        apiUserKey
      )
    ) {
      return {
        error: ApiErrorType.invalidData,
      };
    }

    return {
      data: {
        status: 202,
      },
      raw: {
        status: 202,
      },
    };
  }

  /**
   * Gets the status of a payment in fake mode.
   *
   * @param {GetMtnMomoPaymentRequest} checkStatusParams - The parameters for checking the status
   * @param {string} accessToken - The access token for the request
   * @return {Promise<GetMtnMomoPaymentResponse>} The response containing the payment status
   */
  async getMtnMomoPaymentStatus(
    request: GetMtnMomoPaymentRequest,
    accessToken: string
  ): Promise<GetMtnMomoPaymentResponse> {
    const ocpApimSubscription = this.config.ocpApimSubscriptionKey;
    const xReferenceId = request.referenceId;
    const apiUser = this.config.apiUserKey;
    const apiKey = this.config.apiKey;

    if (!(ocpApimSubscription && xReferenceId && apiKey && apiUser)) {
      return {
        error: ApiErrorType.invalidData,
      };
    }

    return {
      data: {
        status: MtnMomoPaymentStatus.SUCCESSFUL_PAYMENT,
      },
      raw: {
        status: MtnMomoPaymentStatus.SUCCESSFUL_PAYMENT,
        referenceId: xReferenceId,
      },
    };
  }
}
