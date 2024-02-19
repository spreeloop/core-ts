import { AxiosResponse } from 'axios';
import { Logger } from '../../../../logging/src/logging';
import * as requests from '../../common/utils/https';
import { DisbursementXTargetEnvironmentType } from '../utils/constants';
import { transfer } from './transfer';

describe('transfer', () => {
  it('should fail on invalid parameter provided', async () => {
    const { error, data, raw } = await transfer({
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
        webhook: '',
        amount: 0,
        customerPhone: '',
        customerName: '',
        token: '',
      },
      endPoint: '',
    });

    expect(data).not.toBeDefined();
    expect(raw).not.toBeDefined();
    expect(error).toBeDefined();
  });
  it('should fail on invalid phone number provided provided', async () => {
    const { error, data, raw } = await transfer({
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
        webhook: 'https://example.com',
        amount: 100,
        customerPhone: '69532652',
        customerName: 'itachi uchiwa',
        token: 'token',
      },
      endPoint: 'https://example.com',
    });

    expect(data).not.toBeDefined();
    expect(raw).not.toBeDefined();
    expect(error).toBeDefined();
  });
  it('should fail on request failure', async () => {
    const postSpy = jest
      .spyOn(requests, 'postRequest')
      .mockImplementation()
      .mockResolvedValue({
        error: {},
      });
    const { error, data, raw } = await transfer({
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
        webhook: 'https://example.com',
        amount: 100,
        customerPhone: '695326522',
        customerName: 'itachi uchiwa',
        token: 'token',
      },
      endPoint: 'https://example.com',
    });

    expect(data).not.toBeDefined();
    expect(raw).not.toBeDefined();
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(error).toBeDefined();
  });
  it('should succeed on request succeed', async () => {
    const postSpy = jest
      .spyOn(requests, 'postRequest')
      .mockImplementation()
      .mockResolvedValue({
        response: <AxiosResponse>{
          data: {
            MD5OfMessageBody: 'MD5OfMessageBody',
            MD5OfMessageAttributes: 'MD5OfMessageAttributes',
            MessageId: 'MessageId',
            ResponseMetadata: {
              RequestId: 'RequestId',
              HTTPStatusCode: 200,
              HTTPHeaders: {
                'x-amzn-requestid': 'x-amzn-requestid',
                'x-amzn-trace-id': 'x-amzn-trace-id',
                'content-type': 'content-type',
                'content-length': 'content-length',
              },
              RetryAttempts: 2,
            },
          },
        },
      });
    const { error, data, raw } = await transfer({
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
        webhook: 'https://example.com',
        amount: 100,
        customerPhone: '695326522',
        customerName: 'itachi uchiwa',
        token: 'token',
      },
      endPoint: 'https://example.com',
    });

    expect(error).not.toBeDefined();
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(raw).toEqual({
      MD5OfMessageBody: 'MD5OfMessageBody',
      MD5OfMessageAttributes: 'MD5OfMessageAttributes',
      MessageId: 'MessageId',
      ResponseMetadata: {
        RequestId: 'RequestId',
        HTTPStatusCode: 200,
        HTTPHeaders: {
          'x-amzn-requestid': 'x-amzn-requestid',
          'x-amzn-trace-id': 'x-amzn-trace-id',
          'content-type': 'content-type',
          'content-length': 'content-length',
        },
        RetryAttempts: 2,
      },
    });
    expect(data).toBe('MessageId');
  });
});
