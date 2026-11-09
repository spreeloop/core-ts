/**
 * Orange Money API routes builder.
 * @class
 */
export class Routes {
  private readonly baseURL: string;
  private readonly tokenBaseURL: string;

  /**
   * Creates a new instance of the class route.
   *
   * @param {string} baseURL - The Orange Money API base URL.
   * @param {string} version - The API version. Optional.
   */
  constructor(baseURL: string, tokenBaseURL: string, private readonly version?: string) {
    this.version = version ?? '1.0.2';
    if (typeof baseURL !== 'string' || !baseURL.trim()) {
      throw new Error(
        'The Orange Money API host must be provided in the payment configuration.'
      );
    }
    this.baseURL = baseURL.trim().replace(/\/+$/, '');
    this.tokenBaseURL = tokenBaseURL.trim().replace(/\/+$/, '');
  }

  /**
   * Returns the base route for the API.
   *
   * @return {string} The base route for the API.
   */
  baseRoute = (): string => `${this.baseURL}/omcoreapis/${this.version}`;

  /**
   * Initializes the live payment.
   *
   * @return {string} The endpoint URL for the live payment.
   */
  mobileInitPayment(): string {
    return `${this.baseRoute()}/mp/pay`;
  }

  /**
   * Generates the payment status URL based on the provided parameters.
   *
   * @param {object} params - The parameters for generating the payment status URL.
   *  - {string} params.payToken - The pay token.
   * @return {string} The generated payment status URL.
   */
  mobilePaymentStatus(params: { payToken: string }): string {
    return `${this.baseRoute()}/mp/paymentstatus/${params.payToken}`;
  }

  /**
   * Generates the URL for the Mobile Pay token.
   *
   * @return {string} The URL for the Mobile Pay token.
   */
  mobilePayToken(): string {
    return `${this.baseRoute()}/mp/init`;
  }

  /**
   * Generates the mobile access token endpoint.
   *
   * @return {string} The generated mobile access token endpoint.
   */
  mobileAccessToken(): string {
    return `${this.tokenBaseURL}/oauth2/token`;
  }
}
