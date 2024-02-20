import {
  merchantPhoneNumberRegex,
  orangeMoneyPhoneNumberWithoutCountryCodeRegex,
} from './regex';

describe('Test regex merchant phone number', () => {
  test('Merchant phone number regex matches valid numbers', () => {
    const validNumbers = ['699947943', '237699947943'];
    validNumbers.forEach((number) => {
      expect(merchantPhoneNumberRegex.test(number)).toBe(true);
    });
  });

  test('Merchant phone number regex does not match invalid numbers', () => {
    const invalidNumbers = ['12345', '23712345', 'abc'];
    invalidNumbers.forEach((number) => {
      expect(merchantPhoneNumberRegex.test(number)).toBe(false);
    });
  });
});
describe('Test regex orange money phone number without country code', () => {
  test('Oman phone number without country code regex matches valid numbers', () => {
    const validNumbers = ['696512345', '696898765'];
    validNumbers.forEach((number) => {
      expect(orangeMoneyPhoneNumberWithoutCountryCodeRegex.test(number)).toBe(
        true
      );
    });
  });

  test('Orange money phone number without country code regex does not match invalid numbers', () => {
    const invalidNumbers = ['12345', '96812345', 'abc'];
    invalidNumbers.forEach((number) => {
      expect(orangeMoneyPhoneNumberWithoutCountryCodeRegex.test(number)).toBe(
        false
      );
    });
  });
});
