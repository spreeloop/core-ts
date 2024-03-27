import { AxiosError, AxiosResponse } from 'axios';
import * as requests from '../../utils/https';
import { DisbursementXTargetEnvironmentType } from '../utils/constants';
import { Token, createAccessToken } from './create_access_token';

describe('createAccessToken', () => {
  it('Should fail on invalid parameter', async () => {
    const result = await createAccessToken({
      endPoint: '',
      configs: {
        channelUserMsisdn: '',
        clientId: '',
        clientSecret: '',
        customerKey: '',
        customerSecret: '',
        pin: '',
        environment: DisbursementXTargetEnvironmentType.sandbox,
        logger: console,
      },
    });
    expect(result.data).toBeUndefined();
  });

  it('Should fail on request rejection', async () => {
    const errorMessage = 'mock reject the request';
    const postSpy = jest
      .spyOn(requests, 'postRequest')
      .mockImplementation()
      .mockResolvedValue({ error: new AxiosError(errorMessage) });

    const result = await createAccessToken({
      endPoint: 'https://route.com/link',
      configs: {
        channelUserMsisdn: '237699947943',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        customerKey: 'customerKey',
        customerSecret: 'customerSecret',
        pin: 'pin',
        environment: DisbursementXTargetEnvironmentType.sandbox,
        logger: console,
      },
    });

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(result.data).toBeUndefined();
    expect(result.error).toBeDefined();
    postSpy.mockRestore();
  });

  it('Should successfully retrieve token', async () => {
    const accessToken = 'THEaCCESStOKEN';
    const postSpy = jest
      .spyOn(requests, 'postRequest')
      .mockImplementation()
      .mockResolvedValue({
        response: <AxiosResponse<Token>>{
          data: {
            access_token: accessToken,
          },
        },
      });

    const result = await createAccessToken({
      endPoint: 'https://route.com/link',
      configs: {
        channelUserMsisdn: '237699947943',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        customerKey: 'customerKey',
        customerSecret: 'customerSecret',
        pin: 'pin',
        environment: DisbursementXTargetEnvironmentType.sandbox,
        logger: console,
      },
    });

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(result.error).toBeUndefined();
    expect(result.raw).toEqual({
      access_token: accessToken,
    });
    expect(result.data).toBe(accessToken);
    postSpy.mockRestore();
  });
});
