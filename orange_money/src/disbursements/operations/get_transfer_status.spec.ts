import { AxiosResponse } from 'axios';
import { Logger } from '../../../../logging/src/logging';
import * as requests from '../../utils/https';
import { DisbursementXTargetEnvironmentType } from '../utils/constants';
import { DisbursementApiRawStatus, DisbursementStatus } from '../utils/status';
import { DisbursementStep, getTransferStatus } from './get_transfer_status';

describe('getTransferStatus', () => {
  it('should fail on invalid parameter provided', async () => {
    const { error, data, raw } = await getTransferStatus({
      configs: {
        channelUserMsisdn: '',
        clientId: '',
        clientSecret: '',
        customerKey: '',
        customerSecret: '',
        pin: '',
        environment: DisbursementXTargetEnvironmentType.sandbox,
        logger: new Logger(),
      },
      params: {
        token: 55 as unknown as string,
        messageId: 'messageId',
      },
      endPoint: 'https://example.com',
    });

    expect(data).not.toBeDefined();
    expect(raw).not.toBeDefined();
    expect(error).toBeDefined();
  });
  it('should fail on request failure', async () => {
    const requestSpy = jest
      .spyOn(requests, 'getRequest')
      .mockImplementation()
      .mockResolvedValue({
        error: {},
      });
    const { error, data, raw } = await getTransferStatus({
      configs: {
        channelUserMsisdn: '237699947943',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        customerKey: 'customerKey',
        customerSecret: 'customerSecret',
        pin: 'pin',
        environment: DisbursementXTargetEnvironmentType.sandbox,
        logger: new Logger(),
      },
      params: {
        token: 'token',
        messageId: 'messageId',
      },
      endPoint: 'https://example.com',
    });

    expect(data).not.toBeDefined();
    expect(raw).not.toBeDefined();
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(error).toBeDefined();
  });
  it('should succeed on request succeed', async () => {
    const succeedEg = {
      result: {
        message: 'message',
        data: {
          createtime: 'createtime',
          subscriberMsisdn: 'subscriberMsisdn',
          amount: 500,
          payToken: 'payToken',
          txnid: 'txnid',
          txnmode: 'txnmode',
          txnstatus: 'txnstatus',
          orderId: 'orderId',
          status: DisbursementApiRawStatus.succeeded,
          channelUserMsisdn: 'channelUserMsisdn',
          description: 'description',
        },
      },
      parameters: {
        amount: 500,
        xauth: 'xauth',
        channel_user_msisdn: 'channel_user_msisdn',
        customer_key: 'customer_key',
        customer_secret: 'customer_secret',
        final_customer_name: 'final_customer_name',
        final_customer_phone: 'final_customer_phone',
      },
      CreateAt: 'CreateAt',
      MessageId: 'MessageId',
      RefundStep: DisbursementStep.TransferSent,
    };
    const requestSpy = jest
      .spyOn(requests, 'getRequest')
      .mockImplementation()
      .mockResolvedValue({
        response: { data: Object(succeedEg) } as AxiosResponse<
          unknown,
          unknown
        >,
      });
    const { error, data, raw } = await getTransferStatus({
      configs: {
        channelUserMsisdn: '237699947943',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        customerKey: 'customerKey',
        customerSecret: 'customerSecret',
        pin: 'pin',
        environment: DisbursementXTargetEnvironmentType.sandbox,
        logger: new Logger(),
      },
      params: {
        token: 'token',
        messageId: 'messageId',
      },
      endPoint: 'https://example.com',
    });

    expect(error).not.toBeDefined();
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(raw).toEqual(succeedEg);
    expect(
      (raw as { parameters?: { customer_secret?: unknown } })?.parameters
        ?.customer_secret
    ).toBeNull();
    expect(data).toStrictEqual({
      status: DisbursementStatus.succeeded,
      refundStep: DisbursementStep.TransferSent,
    });
  });
});
