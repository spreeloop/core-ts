import { XTargetEnvironmentType } from "../../utils/constants";
import { LoggerInterface } from "../../utils/logging_interface";
import { OperationResponse } from "../../utils/operation_response";
import { TargetEnvironment } from "../../utils/constants";
import { MtnMomoFailedPaymentReason, MtnMomoPaymentStatus } from "./constants";

export interface MtnMomoPaymentParams {
  /**
   * The target environment.
   */
  targetEnvironment: TargetEnvironment;

  /**
   * The logger.
   */
  logger: LoggerInterface;

  /**
   * The API  key.
   */
  apiKey: string;

  /**
   * The API user key.
   */
  apiUserKey: string;

  /**
   * The identifier of the EWP system where the transaction shall be processed.
   */
  xTargetEnvironment: XTargetEnvironmentType;

  /**
   * Subscription key which provides access to this API. Found in your Profile.
   */
  ocpApimSubscriptionKey: string;
}

export type InitializeMtnMomoPaymentRequest = {
  /**
   * Resource ID of the created request to pay transaction.
   * Nb: format UUID version 4.
   */
  xReferenceId: string;

  /**
   * URL to the server where the callback should be sent.
   */
  xCallbackUrl?: string;

  /**
   * Amount that will be debited from the payer account.
   */
  amount: string;
  /**
   *  External id is used as a reference to the transaction.
   *  External id is used for reconciliation. The external id will
   *  be included in transaction history report. External id is
   *  not required to be unique.
   */
  externalId: string;

  /**
   * The phone number of the user making the payment.
   */
  userPhoneNumber: string;

  /**
   * Message that will be written in the payer transaction
   * history message field
   */
  payerMessage?: string;

  /**
   * Message that will be written in the payee transaction history note field.
   */
  payeeNote?: string;

  /**
   * The ISO4217 Currency.
   */
  currency?: string;
};

export type GetMtnMomoPaymentRequest = {
  /**
   * Reference id used when creating the request to pay.
   */
  referenceId: string;
};

/**
 * The provider access token request response from the OM server.
 */
export type AccessTokenRequestResponseFromMtn = {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
};

/**
 * The provider generic response data of payment request of status verification request.
 */
export type GetStatusRequestResponseDataFromMtn = {
  referenceId?: string;
  status?: string;
  financialTransactionId?: string;
  reason?: string;
};

/**
 * This response is obtained when we initiate a mobile payment request,
 * the request would generate a payToken useful to make payment
 * and track the status of payment.
 */
export type InitializeMtnMomoResponse = OperationResponse<{
  status: 202;
}>;

export type GetMtnMomoPaymentResponse = OperationResponse<
  {
    status: MtnMomoPaymentStatus;
    reason?: MtnMomoFailedPaymentReason;
  },
  GetStatusRequestResponseDataFromMtn
>;

export type GetAccessTokenResponse = OperationResponse<
  string,
  AccessTokenRequestResponseFromMtn | undefined
>;
