import Joi from 'joi';
import { LoggerInterface } from '../../utils/logging_interface';
import { TargetEnvironment } from '../../utils/utils';
import { OrangeMoneyPaymentStatus } from './constants';

/**
 * The provider generic response data of payment request of status verification request.
 */
export type GenericRequestResponseData = {
  message: string;
  data: {
    id: number;
    createtime: string | null;
    subscriberMsisdn: string;
    amount: number;
    payToken: string;
    txnid: string | null;
    txnmode: string | null;
    inittxnmessage: string;
    inittxnstatus: string;
    confirmtxnstatus: string | null;
    confirmtxnmessage: string | null;
    status: OrangeMoneyPaymentStatus;
    notifUrl: string | null;
    description: string | null;
    channelUserMsisdn: string;
  };
};

/**
 * The provider generic response data of payment request of status verification request.
 * We only make validation off fields that are required.
 */
export const genericRequestResponseSchema =
  Joi.object<GenericRequestResponseData>({
    message: Joi.string().required(),
    data: Joi.object({
      subscriberMsisdn: Joi.string().required(),
      amount: Joi.number().required(),
      inittxnmessage: Joi.string().allow(null).allow('').required(),
      status: Joi.string()
        .valid(
          OrangeMoneyPaymentStatus.FAILED_PAYMENT,
          OrangeMoneyPaymentStatus.PENDING_PAYMENT,
          OrangeMoneyPaymentStatus.CANCELLED_PAYMENT,
          OrangeMoneyPaymentStatus.EXPIRED_PAYMENT,
          OrangeMoneyPaymentStatus.SUCCESSFULL_MOBILE_PAYMENT
        )
        .required(),
      channelUserMsisdn: Joi.string().required(),
    })
      .required()
      .unknown(true),
  });

export type InitPaymentBodySchema = {
  orderId: string;
  description: string;
  orangeMoneyVersion?: string;
  notifUrl: string;
  pin: string;
  payToken: string;
  amount: number;
  channelUserMsisdn: string;
  subscriberMsisdn: string;
};

export const initPaymentBodySchema = Joi.object<InitPaymentBodySchema>({
  subscriberMsisdn: Joi.string()
    .required()
    .pattern(/^(69\d{7}$|65[5-9]\d{6}$)/)
    .message(
      '[subscriberMsisdn] Invalid orange number. Format of valid number: 69******* or 65[5-9]******'
    ),
  channelUserMsisdn: Joi.string()
    .required()
    .pattern(/^(69\d{7}$|65[5-9]\d{6}$)/)
    .message(
      '[channelUserMsisdn] Invalid orange number. Format of valid number: 69******* or 65[5-9]******'
    ),
  amount: Joi.string().required(),
  payToken: Joi.string().required(),
  pin: Joi.string().max(4).required(),
  notifUrl: Joi.string().allow('').default(''),
  orangeMoneyVersion: Joi.string().optional(),
  description: Joi.string().allow('').max(125).default('payment'),
  orderId: Joi.string().max(20).required(),
});

export interface OrangeMoneyPaymentParams {
  targetEnvironment: TargetEnvironment;
  logger: LoggerInterface;
  apiUserName: string;
  apiPassword: string;
  xAuthToken: string;
  orangeMoneyVersion?: string;
}

/**
 * The provider access token request response from the OM server.
 */
export type AccessTokenRequestResponse = {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
};

/**
 * The provider payToken request response from the OM server.
 */
export type PayTokenRequestResponse = {
  message: string;
  data: {
    payToken: string;
  };
};
