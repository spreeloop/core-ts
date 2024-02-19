import Joi from 'joi';
import { OrangeMoneyErrorType, OrangePaymentStatus } from '../constants';

export type ProviderPaymentRequestResponse = {
  message: string;
  data: {
    id: number;
    createtime: string;
    subscriberMsisdn: null | string;
    amount: number;
    payToken: string;
    txnid: string;
    txnmode: string;
    inittxnmessage: string;
    inittxnstatus: string;
    confirmtxnstatus: string | null;
    confirmtxnmessage: string | null;
    status: OrangePaymentStatus;
    notifUrl: string;
    description: string;
    channelUserMsisdn: string;
  };
};
export const providerPaymentRequestResponseSchema = {
  message: Joi.string().required(),
  data: Joi.object({
    id: Joi.number().required(),
    createtime: Joi.string().allow('').required(),
    subscriberMsisdn: Joi.string().allow(null).required(),
    amount: Joi.number().required(),
    payToken: Joi.string().required(),
    txnid: Joi.string().allow('', null).required(),
    txnmode: Joi.string().allow('').required(),
    inittxnmessage: Joi.string().allow('').required(),
    inittxnstatus: Joi.string().required(),
    confirmtxnstatus: Joi.string().allow('').allow(null),
    confirmtxnmessage: Joi.string().allow('').allow(null),
    status: Joi.string()
      .valid(
        OrangePaymentStatus.FAILED_PAYMENT,
        OrangePaymentStatus.PENDING_PAYMENT,
        OrangePaymentStatus.CANCELLED_PAYMENT,
        OrangePaymentStatus.EXPIRED_PAYMENT,
        OrangePaymentStatus.SUCCESSFULL_MOBILE_PAYMENT
      )
      .required(),
    notifUrl: Joi.string().allow('').required(),
    description: Joi.string().allow('').required(),
    channelUserMsisdn: Joi.string().allow('').required(),
  }).required(),
};

export type ProviderAccessTokenRequestResponse = {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
};
export type ProviderPayTokenRequestResponse = {
  message: string;
  data: {
    payToken: string;
  };
};

/**
 * The record return when the function failed.
 */
export type ErrorResponse = {
  message: string;
  status: number;
  data: unknown;
};

/**
 * [AccessTokenResponse],Returns response values when
 * the token is generated successfully.
 */
export type AccessTokenResponse = {
  /**
   * The access tokens.
   */
  accessToken: string;
};

/**
 * This response is obtained when we initiate a mobile payment request,
 * the request would generate a payToken useful to make payment
 * and track the status of payment.
 */
export type PaymentInitializationResponse = {
  /**
   * The payment status.
   */
  status: OrangePaymentStatus;

  /**
   * The payToken value useful to make payment
   * and track the status of payment.
   */
  payToken: string;

  /**
   * URL generated to finalize the web payment.
   */
  paymentUrl?: string;
};

/**
 * This response is obtained when we initiate a mobile payment request,
 * the request would generate a payToken useful to make payment
 * and track the status of payment.
 */
export type MobilePaymentInitializationResponse =
  | {
      /**
       * The orange money error.
       */
      orangeMoneyError: OrangeMoneyErrorType;
    }
  | {
      /**
       * The payment status.
       */
      status: OrangePaymentStatus;

      /**
       * The payToken value useful to make payment
       * and track the status of payment.
       */
      payToken: string;
    };

export type MobilePaymentCheckStatusResponse =
  | {
      /**
       * The orange money error.
       */
      orangeMoneyError: OrangeMoneyErrorType;
    }
  | {
      /**
       * The payment status.
       */
      status: OrangePaymentStatus;
    };

/**
 * This response is obtained when we generate a mobile paytoken request,
 */
export type MobilePayTokenResponse = {
  /**
   * The paytoken retrieved.
   */
  payToken: string;
};
