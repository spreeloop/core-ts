import { DisbursementApiRawStatus, DisbursementStatus } from './status';

/**
 * Maps a raw status from the Disbursement API to a DisbursementStatus.
 *
 * @param {DisbursementApiRawStatus} rawStatus - The raw status from the Disbursement API.
 * @return {DisbursementStatus} The corresponding DisbursementStatus.
 */
export function getStatusFromProviderRawStatus(
  rawStatus: DisbursementApiRawStatus
): DisbursementStatus {
  switch (rawStatus) {
    case DisbursementApiRawStatus.pending:
    case DisbursementApiRawStatus.initialized:
      return DisbursementStatus.pending;
    case DisbursementApiRawStatus.succeeded:
    case DisbursementApiRawStatus.succeeded2:
      return DisbursementStatus.succeeded;
    case DisbursementApiRawStatus.canceled:
    case DisbursementApiRawStatus.expired:
    case DisbursementApiRawStatus.failed:
      return DisbursementStatus.failed;
  }
}
