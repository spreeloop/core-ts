/**
 * Mtn Momo API routes builder.
 * @class
 */
export class Routes {
  private readonly baseUrl: string;

  /**
   * Creates a new instance of the class route.
   *
   * @param {string} baseURL - The API base URL.
   */
  constructor(baseURL: string) {
    if (typeof baseURL !== "string" || !baseURL.trim()) {
      throw new Error(
        "The MTN MoMo baseURL must be provided in the configuration."
      );
    }
    this.baseUrl = baseURL.trim().replace(/\/+$/, "");
  }

  /**
   * Returns the base route for the API.
   *
   * @return {string} The base route for the API.
   */
  baseRoute = (): string => this.baseUrl;

  /**
   * Initializes the payment.
   *
   * @return {string} The endpoint URL for the payment.
   */
  initPayment(): string {
    return `${this.baseRoute()}/collection/v1_0/requesttopay`;
  }

  /**
   * Generates the payment status URL based on the provided parameters.
   *
   * @param {object} params - The parameters for generating the payment status URL.
   *  - {string} params.referenceId - The reference id.
   * @return {string} The payment status URL.
   */
  paymentStatus(params: { referenceId: string }): string {
    return `${this.baseRoute()}/collection/v1_0/requesttopay/${
      params.referenceId
    }`;
  }

  /**
   * Generates the access token endpoint.
   *
   * @return {string} The access token endpoint.
   */
  accessToken(): string {
    return `${this.baseRoute()}/collection/token/`;
  }

  /**
   * Generates the api user endpoint.
   *
   * @return {string} The api user endpoint.
   */
  apiUser(): string {
    return `${this.baseRoute()}/v1_0/apiuser`;
  }

  /**
   * Generates the api key endpoint.
   *
   * @param {object} params - The parameters for generating the api key URL.
   *  - {string} params.referenceId - The reference id.
   * @return {string} The api key endpoint.
   */
  apiKey(params: { referenceId: string }): string {
    return `${this.baseRoute()}/v1_0/apiuser/${params.referenceId}/apikey`;
  }
}
