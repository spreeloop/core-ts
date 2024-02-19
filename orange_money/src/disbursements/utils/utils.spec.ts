import { DisbursementApiRawStatus, DisbursementStatus } from './status';
import { getStatusFromProviderRawStatus } from './utils';

describe('getStatusFromProviderRawStatus', () => {
  test('should map raw status to disbursement status', () => {
    const testCases = [
      {
        rawStatus: DisbursementApiRawStatus.pending,
        expectedStatus: DisbursementStatus.pending,
      },
      {
        rawStatus: DisbursementApiRawStatus.initialized,
        expectedStatus: DisbursementStatus.pending,
      },
      {
        rawStatus: DisbursementApiRawStatus.succeeded,
        expectedStatus: DisbursementStatus.succeeded,
      },
      {
        rawStatus: DisbursementApiRawStatus.succeeded2,
        expectedStatus: DisbursementStatus.succeeded,
      },
      {
        rawStatus: DisbursementApiRawStatus.canceled,
        expectedStatus: DisbursementStatus.failed,
      },
      {
        rawStatus: DisbursementApiRawStatus.expired,
        expectedStatus: DisbursementStatus.failed,
      },
      {
        rawStatus: DisbursementApiRawStatus.failed,
        expectedStatus: DisbursementStatus.failed,
      },
    ];

    testCases.forEach(({ rawStatus, expectedStatus }) => {
      const result = getStatusFromProviderRawStatus(rawStatus);
      expect(result).toBe(expectedStatus);
    });
  });
});
