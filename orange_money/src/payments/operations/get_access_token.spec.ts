import * as requests from '../../utils/https';
import { TargetEnvironment } from '../../utils/utils';
import { AccessTokenRequestResponse } from '../utils/joi_schema';

import { getAccessToken } from './get_access_token';

const mobileAccessTokenResponse: AccessTokenRequestResponse = {
  access_token: '1e23bee1-37dc-3015-a7d6-cb70e566bd64',
  token_type: 'bearer',
  expires_in: 3600,
  scope: 'read write',
};

const logger = console;
describe('Test the generation of access-token', () => {
  it('Generates the access token failed', async () => {
    jest.spyOn(requests, 'postRequest').mockResolvedValue({
      error: {
        responseError: {
          data: [Object],
          status: 401,
          statusText: 'Unauthorized',
          headers: null,
        },
      },
    });
    const result = await getAccessToken(
      {
        targetEnvironment: TargetEnvironment.fake,
        xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
        apiUserName: 'secret',
        apiPassword: 'secret',
        logger: logger,
      },
      'https://api.paytoken.co'
    );
    expect(result.error).toBeDefined();
  });

  it('Successful generate access token', async () => {
    jest.spyOn(requests, 'postRequest').mockResolvedValue({
      response: {
        data: mobileAccessTokenResponse,
        status: 202,
      },
    });

    const result = await getAccessToken(
      {
        targetEnvironment: TargetEnvironment.fake,
        xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
        apiUserName: 'secret',
        apiPassword: 'secret',
        logger: logger,
      },
      'https://api.paytoken.co'
    );
    expect(result.data).toBe('1e23bee1-37dc-3015-a7d6-cb70e566bd64');
  });
});
