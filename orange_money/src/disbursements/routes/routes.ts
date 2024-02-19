import { DisbursementXTargetEnvironmentType } from '../utils/constants';

const apiHost = 'https://omapi.ynote.africa';
const apiTokenHost = 'https://omapi-token.ynote.africa/oauth2/token';

/**
 * Orange Money API routes builder.
 * @class
 */
export class Routes {
  /**
   * Constructs a new {CommonRoutes}.
   * @constructor
   * @param {RoutesParams} config - The required global route configuration.
   */

  /**
   * Returns the base route for the API.
   *  e.g: https://docs.google.com/document/d/1h-gMj7PSGAALxRSofOvLa2g5vF3IpDkUufNrU1hX6Yk/edit?pli=1
   * @return {string} The base route.
   */
  private baseRoute(): string {
    return `${apiHost}/${DisbursementXTargetEnvironmentType.prod}`;
  }

  /**
   * This route is used to create an access token which can then be used to authorize and authenticate towards the other end-points of the API.
   * e.g : https://docs.google.com/document/d/1h-gMj7PSGAALxRSofOvLa2g5vF3IpDkUufNrU1hX6Yk/edit?pli=1 page 2
   * @return {string}
   */
  createAccessToken(): string {
    return apiTokenHost;
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
