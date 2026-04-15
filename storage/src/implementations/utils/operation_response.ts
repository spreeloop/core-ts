/**
 * Data return to user when requesting an operation.
 */
export type FunctionResponse<T, T2 = unknown, R = unknown> = Promise<
  SuccessfulFunctionResponse<T, T2> | FailedFunctionResponse<R>
>;
type SuccessfulFunctionResponse<T, T2 = unknown> = {
  data: T;
  raw: T2;
  error?: never;
};

type FailedFunctionResponse<R = unknown> = {
  data?: never;
  raw?: unknown;
  error: R;
};
