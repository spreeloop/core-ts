export enum RequestKey {
  keyAuthorization = "Authorization",
  keyContentType = "Content-Type",
  keyXReferenceId = "X-Reference-Id",
  keyXCallbackUrl = "X-Callback-Url",
  keySubscriptionKey = "Ocp-Apim-Subscription-Key",
  keyProviderCallbackhost = "providerCallbackHost",
  keyReferenceId = "X-Reference-Id",
  keyEnvironmentTarget = "X-Target-Environment",
  keyAmount = "amount",
  keyCurrency = "currency",
  keyExternalId = "externalId",
  keyPayer = "payer",
  keyPartyIdType = "partyIdType",
  keyPartyId = "partyId",
  keyPayerMessage = "payerMessage",
  keyPayeeNote = "payeeNote",
  keyAccessToken = "access_token",
}

export enum MtnMomoFailedPaymentReason {
  PAYEE_NOT_FOUND = "PAYEE_NOT_FOUND",
  PAYER_NOT_FOUND = "PAYER_NOT_FOUND",
  NOT_ALLOWED = "NOT_ALLOWED",
  NOT_ALLOWED_TARGET_ENVIRONMENT = "NOT_ALLOWED_TARGET_ENVIRONMENT",
  INVALID_CALLBACK_URL_HOST = "INVALID_CALLBACK_URL_HOST",
  INVALID_CURRENCY = "INVALID_CURRENCY",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  INTERNAL_PROCESSING_ERROR = "INTERNAL_PROCESSING_ERROR",
  NOT_ENOUGH_FUNDS = "NOT_ENOUGH_FUNDS",
  PAYER_LIMIT_REACHED = "PAYER_LIMIT_REACHED",
  PAYEE_NOT_ALLOWED_TO_RECEIVE = "PAYEE_NOT_ALLOWED_TO_RECEIVE",
  PAYMENT_NOT_APPROVED = "PAYMENT_NOT_APPROVED",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  APPROVAL_REJECTED = "APPROVAL_REJECTED",
  EXPIRED = "EXPIRED",
  TRANSACTION_CANCELED = "TRANSACTION_CANCELED",
  RESOURCE_ALREADY_EXIST = "RESOURCE_ALREADY_EXIST",
  COULD_NOT_PERFORM_TRANSACTION = "COULD_NOT_PERFORM_TRANSACTION",
}

export enum ApiErrorType {
  insufficientFunds = "insufficientFunds",
  invalidData = "invalidData",
  failedToInitiateThePayment = "failedToInitiateThePayment",
  failedToGenerateAccessToken = "failedToGenerateAccessToken",
  failedToCheckPaymentStatus = "failedToCheckPaymentStatus",
  accountLocked = "accountLocked",
  invalidPaymentAmount = "invalidPaymentAmount",
  unauthorized = "unauthorized",
}

/**
 * The status of payment request.
 */
export enum MtnMomoPaymentStatus {
  /**
   * User has clicked on “Confirmed”, transaction
   * is in progress on Mtn system.
   */
  PENDING_PAYMENT = "PENDING",

  /**
   * Payment is done.
   */
  SUCCESSFUL_PAYMENT = "SUCCESSFUL",

  /**
   * Payment has failed.
   */
  FAILED_PAYMENT = "FAILED",

  /**
   * Payment has been created.
   */
  CREATED_PAYMENT = "CREATED",
}

/**
 * List all the status code request for mtn payment.
 */
export enum MtnMomoPaymentStatusCode {
  // Successfully created api user.
  apiUserCreated = 201,

  // Successfully created api key.
  apiKeyCreated = 201,

  // Successfully created access token.
  accessTokenCreated = 200,

  // Successfully status retriever.
  statusRetrieved = 200,

  // Successfully initiate the payment.
  paymentInitiated = 202,

  // Unauthorized
  unauthorized = 401,

  // Bad request, e.g. invalid data was sent in the request.
  badRequest = 400,

  // Not found, reference id not found or closed in sandbox.
  notFound = 404,

  // Conflict, duplicated reference id.
  conflictError = 409,

  // Internal error. Check log for information.
  internalError = 500,

  // No response.
  noResponse = 0,
}
