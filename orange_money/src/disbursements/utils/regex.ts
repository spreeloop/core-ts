/**
 * The merchant number regExp authorized for numbers by y-note.
 */
export const merchantPhoneNumberRegex = /^(237)?(69\d{7}$|65[5-9]\d{6}$)/;

/**
 * The orange money phone number regex for orange money numbers without the country code.
 */
export const orangeMoneyPhoneNumberWithoutCountryCodeRegex =
  /^(69\d{7}$|65[5-9]\d{6}$)/;
