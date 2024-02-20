import { TransferResponse } from '../../operations/transfer';
import { CreateAccessTokenResponse } from '../../operations/create_access_token';
import { Routes } from '../../routes/routes';
import {
  DisbursementInterface,
  DisbursementServiceConfig,
} from '../disbursement_service';
import {
  DisbursementStep,
  GetTransferStatusResponse,
} from '../../operations/get_transfer_status';
import {
  DisbursementApiRawStatus,
  DisbursementStatus,
} from '../../utils/status';

/**
 * Orange Money API Fake Disbursement.
 * @class
 */
export class DisbursementFake implements DisbursementInterface {
  protected readonly config: DisbursementServiceConfig;
  protected readonly routes: Routes;
  /**
   * Constructs a new {Disbursement}.
   * @constructor
   * @param {DisbursementServiceConfig} config - The required global route configuration.
   */
  constructor(config: DisbursementServiceConfig) {
    this.routes = new Routes();
    this.config = config;
  }

  /**
   * Creates an access token.
   *
   * @return {Promise<CreateAccessTokenResponse>} The method response containing a string and a token.
   */
  async createAccessToken(): Promise<CreateAccessTokenResponse> {
    return {
      data: 'accessToken',
      raw: {
        access_token: 'accessToken',
        token_type: 'Bearer',
        expires_in: '300',
      },
    };
  }

  /**
   * Transfers the specified amount of money from one account to another.
   *
   * @param {TransferRequest} params - The parameters for the transfer.
   * @return {Promise<TransferResponse>} - The response from the transfer method.
   */
  async transfer(): Promise<TransferResponse> {
    return {
      data: 'f7ec5a39-b1ad-4fa5-a734-60ab4217ba75',
      raw: {
        MD5OfMessageBody: '4b55cf6629b5f0ee3c8ac91435a2eb35',
        MD5OfMessageAttributes: '50e3084aee2bf840dd63b6bbf0a62fa9',
        MessageId: 'f7ec5a39-b1ad-4fa5-a734-60ab4217ba75',
        ResponseMetadata: {
          RequestId: 'bbb43d42-95d1-5a6b-92a7-60c0d420e103',
          HTTPStatusCode: 200,
          HTTPHeaders: {
            'x-amzn-requestid': 'bbb43d42-95d1-5a6b-92a7-60c0d420e103',
            'x-amzn-trace-id':
              'Root=1-65083fb1-37fbf881380338ed3b5fcd2b;Parent=6bfc3c24556c9b27;Sampled=0;Lineage=79e6faf7:0',
            date: 'Mon, 18 Sep 2023 12:16:49 GMT',
            'content-type': 'text/xml',
            'content-length': '459',
          },
          RetryAttempts: 0,
        },
      },
    };
  }

  /**
   * Retrieves the status of a transfer.
   *
   * @param {GetTransferStatusRequest} params - The parameters for retrieving the transfer status.
   * @return {Promise<GetTransferStatusResponse>} - The method response containing the status and transfer status response.
   */
  async getTransferStatus(): Promise<GetTransferStatusResponse> {
    return {
      data: {
        status: DisbursementStatus.succeeded,
        refundStep: DisbursementStep.TransferSent,
      },
      raw: {
        result: {
          message: 'Cash in performed successfully',
          data: {
            subscriberMsisdn: 'subscriberMsisdn',
            channelUserMsisdn: 'channelUserMsisdn',
            createtime: '1695039280',
            amount: 100,
            payToken: 'C2C2309183CB702A1CBB39ECE32C',
            txnid: 'PP230918.1314.B57973',
            txnmode: 'refundYNote',
            txnstatus: '00068',
            orderId: 'refundYNote',
            status: DisbursementApiRawStatus.succeeded,
            description: 'Remboursement Fond',
          },
        },
        parameters: {
          amount: '100',
          xauth: 'WU5PVEVIRUFEOllOT1RFSEVBRDIwMjA=',
          channel_user_msisdn: 'channel_user_msisdn',
          customer_key: 'customer_key',
          customer_secret: 'customer_secret',
          final_customer_name: 'Steve',
          final_customer_phone: '692232239',
        },
        CreateAt: '09-18-2023 12:14:43',
        MessageId: 'caee8310-02fa-45da-9b22-a1effcada25c',
        RefundStep: DisbursementStep.TransferSent,
      },
    };
  }
}
