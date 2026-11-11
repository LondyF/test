import type {TFunction} from 'i18next';
import {
  AsYouType,
  CountryCode,
  getCountryCallingCode,
  isSupportedCountry,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from 'libphonenumber-js/max';
import * as Yup from 'yup';

import {PhoneCountry} from '@src/constants';

export type PhoneNumberParts = {
  country: PhoneCountry;
  localDigits: string;
};

export type PhoneNumberError = 'invalid' | 'notMobile';

const PHONE_NUMBER_ERROR_DEFAULTS: Record<PhoneNumberError, string> = {
  invalid: 'Enter a valid phone number',
  notMobile:
    "Enter a mobile number. We'll send a verification code by text message.",
};

const MOBILE_NUMBER_TYPES = ['MOBILE', 'FIXED_LINE_OR_MOBILE'];

export const toDigits = (text: string) => text.replace(/\D/g, '');

const findCountry = (countries: Array<PhoneCountry>, code?: CountryCode) =>
  countries.find(country => country.code === code);

const toPhoneCountry = (row: LovPhoneCountry): PhoneCountry | null => {
  const code = row.iso?.trim().toUpperCase();
  if (!code || !isSupportedCountry(code)) {
    return null;
  }

  const dialPrefix = toDigits(row.dialPrefix ?? '');
  const callingCode = getCountryCallingCode(code);
  if (!dialPrefix.startsWith(callingCode)) {
    return null;
  }

  const areaPrefix = dialPrefix.slice(callingCode.length);
  return {
    code,
    name: row.naam?.trim() || code,
    dialPrefix,
    displayPrefix: areaPrefix
      ? `+${callingCode} ${areaPrefix}`
      : `+${callingCode}`,
    residenceCode: row.lndKde ?? undefined,
  };
};

export const toPhoneCountries = (
  rows: Array<LovPhoneCountry>,
): Array<PhoneCountry> => {
  const countries = [...rows]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(toPhoneCountry)
    .filter((country): country is PhoneCountry => country !== null);

  return countries.filter(
    (country, index) =>
      countries.findIndex(other => other.code === country.code) === index,
  );
};

const getFallbackCountry = (
  countries: Array<PhoneCountry>,
  lndKde?: string,
): PhoneCountry =>
  (lndKde
    ? countries.find(country => country.residenceCode === lndKde)
    : undefined) ?? countries[0];

const stripDialPrefix = (country: PhoneCountry, digits: string) =>
  digits.startsWith(country.dialPrefix)
    ? digits.slice(country.dialPrefix.length)
    : digits;

export const buildPhoneNumber = (country: PhoneCountry, localDigits: string) =>
  localDigits ? `${country.dialPrefix}${localDigits}` : '';

export const isTooLong = ({country, localDigits}: PhoneNumberParts) =>
  validatePhoneNumberLength(`+${country.dialPrefix}${localDigits}`) ===
  'TOO_LONG';

export const parseInternationalNumber = (
  text: string,
  countries: Array<PhoneCountry>,
): PhoneNumberParts | null => {
  const parsed = parsePhoneNumberFromString(`+${toDigits(text)}`);
  const country = findCountry(countries, parsed?.country);
  if (!parsed || !country) {
    return null;
  }

  const digits = toDigits(parsed.number);
  if (!digits.startsWith(country.dialPrefix)) {
    return null;
  }

  return {country, localDigits: stripDialPrefix(country, digits)};
};

export const parseStoredPhoneNumber = (
  stored: string | undefined,
  countries: Array<PhoneCountry>,
  lndKde?: string,
): PhoneNumberParts => {
  const digits = toDigits(stored ?? '');
  const fromNumber = digits
    ? parseInternationalNumber(digits, countries)
    : null;
  if (fromNumber) {
    return fromNumber;
  }

  const country = getFallbackCountry(countries, lndKde);
  return {country, localDigits: stripDialPrefix(country, digits)};
};

export const isInternationalInput = (text: string) => {
  const trimmed = text.trim();
  return trimmed.startsWith('+') || trimmed.startsWith('00');
};

export const parsePastedNumber = (
  text: string,
  countries: Array<PhoneCountry>,
): PhoneNumberParts | null => {
  if (!isInternationalInput(text)) {
    return null;
  }

  const trimmed = text.trim();
  const withoutTrunkPrefix = trimmed.startsWith('00')
    ? trimmed.slice(2)
    : trimmed;
  return parseInternationalNumber(withoutTrunkPrefix, countries);
};

export const formatLocalDigits = (
  country: PhoneCountry,
  localDigits: string,
) => {
  if (!localDigits) {
    return '';
  }

  const formatted = new AsYouType().input(
    `+${country.dialPrefix}${localDigits}`,
  );
  if (!formatted.startsWith(country.displayPrefix)) {
    return localDigits;
  }

  return formatted.slice(country.displayPrefix.length).trim();
};

export const getPhoneNumberError = (
  stored: string,
  countries: Array<PhoneCountry>,
): PhoneNumberError | null => {
  const parsed = parsePhoneNumberFromString(`+${toDigits(stored)}`);
  if (!parsed?.isValid() || !findCountry(countries, parsed.country)) {
    return 'invalid';
  }

  return MOBILE_NUMBER_TYPES.includes(parsed.getType() ?? '')
    ? null
    : 'notMobile';
};

type PhoneNumberSchemaOptions = {
  countries: Array<PhoneCountry>;
  requiredMessage: string;
  unchangedValue?: string;
};

export const phoneNumberSchema = (
  t: TFunction,
  {countries, requiredMessage, unchangedValue}: PhoneNumberSchemaOptions,
) =>
  Yup.string()
    .required(requiredMessage)
    .test({
      name: 'phone-number',
      test: (value, context) => {
        if (value === unchangedValue) {
          return true;
        }

        const error = getPhoneNumberError(value ?? '', countries);
        if (!error) {
          return true;
        }

        return context.createError({
          message: t(`phoneInput.${error}`, {
            defaultValue: PHONE_NUMBER_ERROR_DEFAULTS[error],
          }),
        });
      },
    });
