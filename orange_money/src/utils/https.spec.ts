import {
  encodeTheBodyOfRequest,
  encodeToBase64,
  hash,
  parseAxiosError,
} from './https';
import { AxiosError, AxiosResponse } from 'axios';

describe('hash', () => {
  const btoaRef = global.btoa;
  it('should still Hash if the btao function is not available', () => {
    global.btoa = undefined as unknown as typeof btoaRef;
    const hashResponse = hash('key', 'secret');
    expect(hashResponse).toBe('a2V5OnNlY3JldA==');
    global.btoa = btoaRef;
  });
});

describe('parseAxiosError', () => {
  it('should return initial obj if not instance of axios error', () => {
    const initialObj = { key: 'ERROR_100' };
    const parsedResponse = parseAxiosError(initialObj);
    expect(parsedResponse).toBe(initialObj);
  });

  it('should have the configuration failed message when config failed', () => {
    const message = 'configuration failed';
    const parsedResponse = parseAxiosError(
      new AxiosError(message) as unknown as Record<string, unknown>
    );
    expect(parsedResponse).toEqual({
      configFailed: message,
    });
  });

  it('should return request failed when axios is unable to send the request.', () => {
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const parsedResponse = parseAxiosError(
      new AxiosError('message', '400', undefined, request) as unknown as Record<
        string,
        unknown
      >
    );
    expect(parsedResponse).toEqual({
      requestFailed: { data: undefined, headers: undefined },
    });
  });

  it('should return response error when the request response fail to be retrieve.', () => {
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: '',
    };
    const response = <AxiosResponse>{
      data: '',
      status: 201,
      statusText: 'created',
      headers: {},
      request: request,
    };

    const parsedResponse = parseAxiosError(
      new AxiosError(
        'message',
        '400',
        undefined,
        request,
        response
      ) as unknown as Record<string, unknown>
    );
    expect(parsedResponse).toEqual({
      responseError: {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      },
      requestBody: request.body,
    });
  });
});

describe('Test the utils function', () => {
  it('Generate the base 64 encoding', async () => {
    const value = encodeToBase64('123', '123');
    expect(value).toEqual('MTIzOjEyMw');
  });
  it('encode the body request', async () => {
    const body = {
      amount: '123',
    };
    const value = encodeTheBodyOfRequest(body);
    expect(value).toEqual('amount=123');
  });
});
