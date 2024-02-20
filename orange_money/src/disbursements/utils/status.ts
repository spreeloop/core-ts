/**
 * The simplified version of transaction status.
 */
export enum DisbursementStatus {
  /**
   * The transaction failed.
   */
  failed = 'FAILED',

  /**
   * The transaction is pending.
   */
  pending = 'PENDING',

  /**
   * The transaction succeeded.
   */
  succeeded = 'SUCCEEDED',

  /**
   * The status received from the endpoint was not recognized.
   */
  unknown = 'UNKNOWN',
}

export enum DisbursementApiRawStatus {
  /**
   * Transaction is in progress on Orange system.
   */
  pending = 'PENDING',

  /**
   * The user canceled the disbursement.
   */
  canceled = 'CANCELLED',

  /**
   * Waiting for user entry.
   */
  initialized = 'INITIATED',

  /**
   * Disbursement is done for mobile.
   */
  succeeded = 'SUCCESSFULL',

  /**
   * Disbursement is done for web.
   */
  succeeded2 = 'SUCCESS',

  /**
   * Disbursement failed.
   */
  failed = 'FAILED',

  /**
   * The token timed out.
   * Note that the minimum token expiration time is 7 min.
   */
  expired = 'EXPIRED',
}
