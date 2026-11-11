import type {TFunction} from 'i18next';

import {FALLBACK_PHONE_COUNTRIES, PhoneCountry} from '../src/constants';
import {
  buildPhoneNumber,
  formatLocalDigits,
  getPhoneNumberError,
  isTooLong,
  parsePastedNumber,
  parseStoredPhoneNumber,
  phoneNumberSchema,
  toPhoneCountries,
} from '../src/helpers/phoneNumber';

const PHONE_COUNTRIES = toPhoneCountries(FALLBACK_PHONE_COUNTRIES);

const getCountry = (code: string): PhoneCountry =>
  PHONE_COUNTRIES.find(country => country.code === code) as PhoneCountry;

const t = ((_: string, options?: {defaultValue?: string}) =>
  options?.defaultValue ?? '') as unknown as TFunction;

const lovRow = (row: Partial<LovPhoneCountry>): LovPhoneCountry => ({
  iso: 'CW',
  naam: 'Curaçao',
  dialPrefix: '5999',
  sortOrder: 1,
  ...row,
});

describe('toPhoneCountries', () => {
  it.each([
    ['CW', '5999', '+599 9'],
    ['BQ', '599', '+599'],
    ['SX', '1721', '+1 721'],
    ['NL', '31', '+31'],
  ])(
    'derives the display prefix for %s (%s) as %s',
    (iso, dialPrefix, expected) => {
      const [country] = toPhoneCountries([lovRow({iso, dialPrefix})]);

      expect(country.displayPrefix).toBe(expected);
    },
  );

  it('normalizes lowercase ISO codes and a dial prefix with a plus', () => {
    const [country] = toPhoneCountries([
      lovRow({iso: ' cw ', dialPrefix: '+5999'}),
    ]);

    expect(country.code).toBe('CW');
    expect(country.dialPrefix).toBe('5999');
  });

  it.each([
    ['an alpha-3 code', {iso: 'CUW'}],
    ['a residence code', {iso: 'CUR'}],
    ['an unknown code', {iso: 'ZZ'}],
    ['a dial prefix from another country', {iso: 'NL', dialPrefix: '5999'}],
    ['an empty dial prefix', {dialPrefix: ''}],
  ])('drops a row with %s', (_, row) => {
    expect(toPhoneCountries([lovRow(row)])).toEqual([]);
  });

  it('sorts by sortOrder and keeps the first row per ISO code', () => {
    const countries = toPhoneCountries([
      lovRow({iso: 'NL', dialPrefix: '31', naam: 'Nederland', sortOrder: 2}),
      lovRow({sortOrder: 1}),
      lovRow({naam: 'Duplicate', sortOrder: 3}),
    ]);

    expect(countries.map(country => country.code)).toEqual(['CW', 'NL']);
    expect(countries[0].name).toBe('Curaçao');
  });

  it('falls back to the ISO code when the name is empty', () => {
    expect(toPhoneCountries([lovRow({naam: ''})])[0].name).toBe('CW');
  });

  it('maps lndKde to the residence code', () => {
    expect(toPhoneCountries([lovRow({lndKde: 'CUR'})])[0].residenceCode).toBe(
      'CUR',
    );
  });
});

describe('parseStoredPhoneNumber', () => {
  it.each([
    ['59995123456', 'CUR', 'CW', '5123456'],
    ['17215201234', 'CUR', 'SX', '5201234'],
    ['31612345678', 'CUR', 'NL', '612345678'],
    ['2975601234', 'CUR', 'AW', '5601234'],
    ['5993181234', 'CUR', 'BQ', '3181234'],
  ])('parses %s (residence %s) as %s', (stored, lndKde, code, local) => {
    const result = parseStoredPhoneNumber(stored, PHONE_COUNTRIES, lndKde);

    expect(result.country.code).toBe(code);
    expect(result.localDigits).toBe(local);
  });

  it('falls back to the residence country for a legacy Sint Maarten value', () => {
    const result = parseStoredPhoneNumber('5995421234', PHONE_COUNTRIES, 'SXM');

    expect(result.country.code).toBe('SX');
    expect(result.localDigits).toBe('5995421234');
  });

  it.each([
    ['BON', 'BQ'],
    ['SXM', 'SX'],
    ['CUR', 'CW'],
    ['XXX', 'CW'],
    [undefined, 'CW'],
  ])('uses residence %s for an empty number: %s', (lndKde, code) => {
    expect(
      parseStoredPhoneNumber('', PHONE_COUNTRIES, lndKde).country.code,
    ).toBe(code);
  });

  it('round-trips through buildPhoneNumber', () => {
    const {country, localDigits} = parseStoredPhoneNumber(
      '17215201234',
      PHONE_COUNTRIES,
    );

    expect(buildPhoneNumber(country, localDigits)).toBe('17215201234');
  });
});

describe('buildPhoneNumber', () => {
  it('returns an empty string without local digits', () => {
    expect(buildPhoneNumber(getCountry('CW'), '')).toBe('');
  });

  it('prepends the dial prefix', () => {
    expect(buildPhoneNumber(getCountry('CW'), '5123456')).toBe('59995123456');
  });
});

describe('parsePastedNumber', () => {
  it('switches to the pasted country when it is enabled', () => {
    const result = parsePastedNumber('+31 6 12345678', PHONE_COUNTRIES);

    expect(result?.country.code).toBe('NL');
    expect(result?.localDigits).toBe('612345678');
  });

  it('supports the 00 prefix', () => {
    expect(
      parsePastedNumber('0031 6 12345678', PHONE_COUNTRIES)?.country.code,
    ).toBe('NL');
  });

  it('returns null for a country that is not enabled', () => {
    expect(parsePastedNumber('+1 202 555 0123', PHONE_COUNTRIES)).toBeNull();
  });

  it('returns null for a national number', () => {
    expect(parsePastedNumber('5123456', PHONE_COUNTRIES)).toBeNull();
  });
});

describe('formatLocalDigits', () => {
  it.each([
    ['CW', '5123456', '512 3456'],
    ['BQ', '3181234', '318 1234'],
    ['SX', '5201234', '520 1234'],
    ['NL', '612345678', '6 12345678'],
    ['AW', '5601234', '560 1234'],
  ])('formats %s digits %s as %s', (code, local, expected) => {
    expect(formatLocalDigits(getCountry(code), local)).toBe(expected);
  });

  it('returns an empty string without digits', () => {
    expect(formatLocalDigits(getCountry('CW'), '')).toBe('');
  });
});

describe('isTooLong', () => {
  it.each([
    ['CW', '5123456', false],
    ['CW', '51234567', true],
    ['BQ', '7001234', false],
    ['BQ', '70012345', true],
    ['SX', '5201234', false],
    ['SX', '52012345', true],
    ['AW', '5601234', false],
    ['AW', '56012345', true],
  ])('checks %s %s as too long: %s', (code, localDigits, expected) => {
    expect(isTooLong({country: getCountry(code), localDigits})).toBe(expected);
  });
});

describe('getPhoneNumberError', () => {
  it.each([
    ['59995123456', null],
    ['17215201234', null],
    ['31612345678', null],
    ['2975601234', null],
    ['5993181234', null],
    ['5997171234', 'notMobile'],
    ['31201234567', 'notMobile'],
    ['5995421234', 'invalid'],
    ['12025550123', 'invalid'],
    ['123', 'invalid'],
    ['', 'invalid'],
  ])('validates %s as %s', (stored, expected) => {
    expect(getPhoneNumberError(stored, PHONE_COUNTRIES)).toBe(expected);
  });

  it('rejects a country that is not enabled', () => {
    const onlyCuracao = [getCountry('CW')];

    expect(getPhoneNumberError('31612345678', onlyCuracao)).toBe('invalid');
  });
});

describe('phoneNumberSchema', () => {
  const schema = phoneNumberSchema(t, {
    countries: PHONE_COUNTRIES,
    requiredMessage: 'required',
    unchangedValue: '5995421234',
  });

  it('requires a value', async () => {
    await expect(schema.validate('')).rejects.toThrow('required');
  });

  it('accepts a valid mobile number', async () => {
    await expect(schema.validate('59995123456')).resolves.toBe('59995123456');
  });

  it('rejects a landline with the mobile message', async () => {
    await expect(schema.validate('5997171234')).rejects.toThrow(
      'Enter a mobile number',
    );
  });

  it('rejects an invalid number', async () => {
    await expect(schema.validate('59991')).rejects.toThrow(
      'Enter a valid phone number',
    );
  });

  it('skips validation when the value is unchanged', async () => {
    await expect(schema.validate('5995421234')).resolves.toBe('5995421234');
  });
});
