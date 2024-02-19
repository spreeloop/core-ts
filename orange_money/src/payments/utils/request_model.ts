import { OperationResponse } from '../../common/utils/operation_response';
import { ApiErrorType, OrangeMoneyPaymentStatus } from './constants';
import {
  AccessTokenRequestResponse,
  GenericRequestResponseData,
  PayTokenRequestResponse,
} from './joi_schema';

export type InitializeOrangeMoneyRequest = {
  /**
   * The phone number of the user making the payment.
   */
  subscriberNumber: string;
  /**
   * The phone number of the user receiving the payment.
   */
  channelUserNumber: string;
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
   * The payment description.
   */
  description?: string;

  /**
   * The payToken value useful to make payment
   * and track the status of payment.
   */
  payToken: string;

  /**
   * The access token for authorize the request.
   */
  accessToken: string;
};

export type GetOrangeMoneyPaymentRequest = {
  /**
   * The access token for authorize the request.
   */
  accessToken: string;

  /**
   * unique identifier used to obtain payment status.
   */
  payToken: string;
};

/**
 * This response is obtained when we initiate a mobile payment request,
 * the request would generate a payToken useful to make payment
 * and track the status of payment.
 */
export type InitializeOrangeMoneyResponse = OperationResponse<
  {
    /**
     * The payToken value useful to make payment
     * and track the status of payment.
     */
    payToken: string;
  },
  GenericRequestResponseData,
  ApiErrorType
>;

export type GetOrangeMoneyPaymentResponse = OperationResponse<
  {
    status: OrangeMoneyPaymentStatus;
  },
  GenericRequestResponseData,
  ApiErrorType
>;

export type GetAccessTokenResponse = OperationResponse<
  string,
  AccessTokenRequestResponse | undefined,
  ApiErrorType
>;

export type GetPayTokenResponse = OperationResponse<
  string,
  PayTokenRequestResponse | undefined,
  ApiErrorType
>;
