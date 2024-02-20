import * as requests from '../../utils/https';

import { TargetEnvironment } from '../../utils/utils';
import { PayTokenRequestResponse } from '../utils/joi_schema';
import { getPayToken } from './get_pay_token';

const payTokenResponse: PayTokenRequestResponse = {
  message: 'success',
  data: {
    payToken: 'MP220807558VEF7A9C4F09AED',
  },
};

const logger = console;

describe('Test the generation of payToken', () => {
  it('Generate the payToken failed due to invalid credential.', async () => {
    jest.spyOn(requests, 'postRequest').mockImplementationOnce(() =>
      Promise.resolve({
        error: {
          responseError: {
            data: [Object],
            status: 401,
            statusText: 'Unauthorized',
            headers: null,
          },
        },
      })
    );
    const result = await getPayToken(
      {
        logger: logger,
        apiPassword: 'secret',
        apiUserName: 'secret',
        targetEnvironment: TargetEnvironment.fake,
        xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
      },
      '1e23bee1-37dc-3015-a7d6-cb70e566bd64',
      'https://api.paytoken.co'
    );
    expect(result.error).toBeDefined();
  });
  it('Generate the payToken successfully', async () => {
    jest.spyOn(requests, 'postRequest').mockImplementationOnce(() =>
      Promise.resolve({
        response: {
          data: payTokenResponse,
          status: 202,
        },
      })
    );
    const result = await getPayToken(
      {
        logger: logger,
        apiPassword: 'secret',
        apiUserName: 'secret',
        targetEnvironment: TargetEnvironment.fake,
        xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
      },
      '1e23bee1-37dc-3015-a7d6-cb70e566bd64',
      'https://api.paytoken.co'
    );
    expect(result.data).toBe('MP220807558VEF7A9C4F09AED');
  });
});
