import { DisbursementXTargetEnvironmentType } from '../utils/constants';

/**
 * Orange Money API routes builder.
 * @class
 */
export class Routes {
  private readonly baseURL: string;
  private readonly baseURLToken: string;

  /**
   * Constructs a new {CommonRoutes}.
   * @constructor
   * @param {string} baseURL - The disbursement API base URL.
   * @param {string} baseURLToken - The full access-token endpoint URL.
   */
  constructor(baseURL: string, baseURLToken: string) {
    if (typeof baseURL !== 'string' || !baseURL.trim()) {
      throw new Error(
        'The disbursement API host must be provided in the configuration.'
      );
    }
    if (typeof baseURLToken !== 'string' || !baseURLToken.trim()) {
      throw new Error(
        'The disbursement API token endpoint must be provided in the configuration.'
      );
    }

    this.baseURL = baseURL.trim().replace(/\/+$/, '');
    this.baseURLToken = baseURLToken.trim().replace(/\/+$/, '');
  }

  /**
   * Returns the base route for the API.
   *  e.g: https://docs.google.com/document/d/1h-gMj7PSGAALxRSofOvLa2g5vF3IpDkUufNrU1hX6Yk/edit?pli=1
   * @return {string} The base route.
   */
  private baseRoute(): string {
    return `${this.baseURL}/${DisbursementXTargetEnvironmentType.prod}`;
  }

  /**
   * This route is used to create an access token which can then be used to authorize and authenticate towards the other end-points of the API.
   * e.g : https://docs.google.com/document/d/1h-gMj7PSGAALxRSofOvLa2g5vF3IpDkUufNrU1hX6Yk/edit?pli=1 page 2
   * @return {string}
   */
  createAccessToken(): string {
    return `${this.baseURLToken}/oauth2/token`;
  }

  /**
   * This route is used to transfer an amount from the owner’s account to a payee account (customer).
   * e.g : https://docs.google.com/document/d/1h-gMj7PSGAALxRSofOvLa2g5vF3IpDkUufNrU1hX6Yk/edit?pli=1 page 4
   * @return {string} - The transfer route.
   */
  transfer(): string {
    return `${this.baseRoute()}/refund`;
  }

  /**
   * This route is used to get the status of a transfer.
   *
   * @param {string} Id - The reference of the transfer.
   * e.g : https://docs.google.com/document/d/1h-gMj7PSGAALxRSofOvLa2g5vF3IpDkUufNrU1hX6Yk/edit?pli=1  page 9
   * @return {string} - The transfer status route.
   */
  transferStatus(Id: string): string {
    return `${this.baseRoute()}/refund/status/${Id}`;
  }
}
