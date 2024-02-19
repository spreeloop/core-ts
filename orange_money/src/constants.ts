export enum ApiKey {
  keyAuthorization = 'Authorization',
  keyGrantType = 'grant_type',
  keyContentType = 'Content-Type',
  keyXAuthToken = 'X-AUTH-TOKEN',
  keyMerchantKey = 'merchant_key',
  keyCurrency = 'currency',
  keyOrderId = 'order_id',
  keyReturnUrl = 'return_url',
  keyCancelUrl = 'cancel_url',
  keyWebNotifyUrl = 'notif_url',
  keyLang = 'lang',
  keyReference = 'reference',
  keyAmount = 'amount',
  keyPayToken = 'pay_token',
  keySubscriberMsisdn = 'subscriberMsisdn',
  keyChannelUserMsisdn = 'channelUserMsisdn',
  keyDescription = 'description',
  keyMobileOrderId = 'orderId',
  keyPin = 'pin',
  keyMobilePayToken = 'payToken',
  keyMobileNotifUrl = 'notifUrl',
}

export enum TargetEnvironment {
  sandbox = 'dev',
  prod = 'prod',
  fake = 'fake',
}

export const orangeMoneyEndPoint = 'https://api-s1.orange.cm';

/**
 * Contains request fields.
 */
export class ConstantRequestField {
  //  The content type field.
  public static readonly typeJson = 'application/json';

  // The url encode form.
  public static readonly TypeWwwFrom = 'application/x-www-form-urlencoded';

  // The basic authorization field.
  public static readonly basic = 'Basic ';

  //  The authorization field.
  public static readonly authorization = 'AUTHORIZATION';

  // The bearer field.
  public static readonly bearer = 'Bearer ';

  // The grant type field.
  public static readonly grantType = 'grant_type';

  //  The client credentials field.
  public static readonly clientCredentials = 'client_credentials';

  //  The X-AUTH-TOKEN field.
  public static readonly xAuthToken = 'X-AUTH-TOKEN';
}

/**
 * The status of payment request.
 */
export enum OrangePaymentStatus {
  /**
   * User has clicked on “Confirmed”, transaction
   * is in progress on Orange system.
   */
  PENDING_PAYMENT = 'PENDING',

  /**
   * The user canceled the payment.
   */
  CANCELLED_PAYMENT = 'CANCELLED',

  /**
   * Waiting for user entry.
   * Specially for web.
   */
  INITIATE_PAYMENT = 'INITIATED',

  /**
   * Payment is done for mobile.
   */
  SUCCESSFULL_MOBILE_PAYMENT = 'SUCCESSFULL',

  /**
   * Payment is done for web.
   */
  SUCCESS_WEB_PAYMENT = 'SUCCESS',

  /**
   * Payment has failed.
   * On web, the status can failed when user press to confirm payment too
   * late or when user enter a wrong validation code.
   * On mobile, it may fail when the user does not have a mooney orange wallet
   * or the account balance is insufficient.
   */
  FAILED_PAYMENT = 'FAILED',

  /**
   * User has clicked on “Confirmed” too late (after token’s validity), or the
   * delay token timeout has expired.
   * Note that the minimum token expiration time is 7 min.
   */
  EXPIRED_PAYMENT = 'EXPIRED',
}

export enum OrangeMoneyErrorType {
  insufficientFunds = 'Insufficient fund',
  invalidOrangeMoneyNumber = 'Invalid orange money number',
  invalidData = 'Invalid data provided',
  failToInitiateThePayment = 'Failed to initiate the payment',
  failToGenerateAccessToken = 'Failed to generate the access token',
  failToCheckPaymentStatus = 'Failed to check the status of payment',
  failToGeneratePayToken = 'Failed to generate payToken',
  lockAccount = 'Account locked',
  invalidPaymentAmount = 'Amount greater than the maximum allowed',
}
