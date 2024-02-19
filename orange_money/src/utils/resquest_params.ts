import * as Joi from 'joi';

export enum LanguageSupported {
  en = 'en',
  fr = 'fr',
}

export type MobileInitializationParams = {
  /**
   * The channelUser api username.
   */
  apiUserName: string;
  /**
   * The ChannelUser api password.
   */
  apiPassword: string;
  /**
   * The x-auth-token.
   */
  xAuthToken: string;
  /**
   * The phone number of the user making the payment.
   */
  userPhoneNumber: string;
  /**
   * The phone number of the user receiving the payment.
   */
  receiverPhoneNumber: string;
  /**
   * Unique identifier of the customer transaction.
   */
  transactionId: string;
  /**
   * The amount of the transaction.
   */
  amount: number;
  /**
   * The Pin code of the ChannelUser.
   */
  pinCode: string;
  /**
   * An http endpoint able to receive a post request with the following json body.
   * {
   *  ”payToken” : ”payToken”,
   *     ”status” : status”,
   *    ”message” : ”message”
   *  }
   */
  notifUrl?: string;
  /**
   * The mobile orange money version apply for payment request.The default orange money version is
   * 1.0.2: https://apiw.orange.cm/omcoreapis/1.0.2/mp/pay
   */
  orangeMoneyVersion?: string;
  /**
   * The payment description.
   */
  description?: string;
};

export type ProvideInitializationBodySchema = {
  /**
   * The x-auth-token.
   */
  orderId: string;
  /**
   * The phone number of the user making the payment.
   */
  description: string;
  /**
   * The phone number of the user receiving the payment.
   */
  orangeMoneyVersion?: string;
  /**
   * Unique identifier of the customer transaction.
   */
  notifUrl: string;
  /**
   * The amount of the transaction.
   */
  pin: string;
  /**
   * The Pin code of the ChannelUser.
   */
  payToken: string;
  /**
   * An http endpoint able to receive a post request with the following json body.
   * {
   *  ”payToken” : ”payToken”,
   *     ”status” : status”,
   *    ”message” : ”message”
   *  }
   */
  amount: number;
  /**
   * The mobile orange money version apply for payment request.The default orange money version is
   * 1.0.2: https://apiw.orange.cm/omcoreapis/1.0.2/mp/pay
   */
  channelUserMsisdn: string;
  /**
   * The payment description.
   */
  subscriberMsisdn: string;
};

export const provideInitializationBodySchema = {
  subscriberMsisdn: Joi.string()
    .required()
    .pattern(/^(69\d{7}$|65[5-9]\d{6}$)/)
    .message('Invalid orange number. Format of valid number: 699947943 '),
  channelUserMsisdn: Joi.string()
    .required()
    .pattern(/^(69\d{7}$|65[5-9]\d{6}$)/)
    .message('Invalid orange number. Format of valid number: 699947943'),
  amount: Joi.string().required(),
  payToken: Joi.string().required(),
  pin: Joi.string().max(4).required(),
  notifUrl: Joi.string().allow('').default(''),
  orangeMoneyVersion: Joi.string(),
  description: Joi.string().allow('').max(125).default('payment'),
  orderId: Joi.string().max(20).required(),
};

export const joiMobileStatusCheckValidatorParams =
  Joi.object<MobileParamsForCheckStatus>({
    xAuthToken: Joi.string().required(),
    payToken: Joi.string().required(),
    apiUserName: Joi.string().required(),
    apiPassword: Joi.string().required(),
    mobileOmVersion: Joi.string(),
  });

export type WebInitializationParams = {
  /**
   * The encode to base64 of api username and api password.
   */
  authorization?: string;
  /**
   * The channelUser secret code.
   */
  merchantKey?: string;
  /**
   * The currency to apply to the amount.
   */
  currency?: string;
  /**
   * The user language (en or fr)
   */
  language?: LanguageSupported;
  /**
   * An http url called when the user validates the payment.
   */
  returnUrl?: string;
  /**
   * An http url called when the user cancels the payment.
   */
  cancelUrl?: string;
  /**
   * Unique identifier of the customer transaction.
   */
  transactionId?: string;
  /**
   * The amount of the transaction.
   */
  amount?: string;
  /**
   * An http endpoint able to receive a post request with the following json body
   * {
   *  ”payToken” : ”payToken”,
   *     ”status” : status”,
   *    ”message” : ”message”
   *  }
   */
  notifUrl?: string;
  /**
   * The web orange money version apply for generate an access token request.The default orange money version
   * is v3. Use case: https://apiw.orange.cm/oauth/v3/token
   */
  weOmVersion?: string;
  /**
   * the payment reference. usually it takes as value the name of the channel.
   */
  reference?: string;
  /**
   * the channel country code.
   * example: 'cm' for cameroon, 'ci' for Ivory coast
   */
  countryCode?: string;
};

export type MobileParamsForCheckStatus = {
  /**
   * unique identifier used to obtain payment status.
   */
  payToken: string;
  /**
   * The x-auth-token.
   */
  xAuthToken: string;
  /**
   * The mobile orange money version apply for payment request.The default orange money version used is
   * 1.0.2.
   */
  mobileOmVersion?: string;

  /**
   * The channelUser api username.
   */
  apiUserName: string;
  /**
   * The ChannelUser api password.
   */
  apiPassword: string;
};

export type WebParamsForCheckStatus = {
  /**
   * The unique identifier used to obtain payment status.
   */
  payToken?: string;
  /**
   * The amount of the transaction.
   */
  amount?: string;
  /**
   * Unique identifier of the customer transaction.
   */
  transactionId?: string;
  /**
   * The encode to base64 of api username and api password.
   */
  authorization?: string;

  /**
   * Country code of the country where the request will be executed.
   * example: 'cm' for cameroon, 'ci' for Ivory coast
   */
  countryCode?: string;
  /**
   * The web orange money version apply for generate an access token request.The default orange money version
   * is v3. Use case: https://apiw.orange.cm/oauth/v3/token
   */
  weOmVersion?: string;
};
