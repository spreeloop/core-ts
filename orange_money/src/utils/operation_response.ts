/**
 * Data return to user when requesting an operation.
 */
export type OperationResponse<T, T2 = unknown, R = unknown> = Promise<
  SuccessfulOperationResponse<T, T2> | FailedOperationResponse<R>
>;
type SuccessfulOperationResponse<T, T2 = unknown> = {
  data: T;
  raw: T2;
  error?: never;
};

type FailedOperationResponse<R = unknown> = {
  data?: never;
  raw?: unknown;
  error: R;
};
