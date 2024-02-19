import { encodeTheBodyOfRequest, encodeToBase64 } from './utils';

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
