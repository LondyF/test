import React, {useEffect, useRef, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';

import {faChevronDown} from '@fortawesome/pro-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useTranslation} from 'react-i18next';

import {PhoneCountry} from '@src/constants';
import usePhoneCountries from '@hooks/usePhoneCountries';
import {
  buildPhoneNumber,
  formatLocalDigits,
  isTooLong,
  parsePastedNumber,
  parseStoredPhoneNumber,
  toDigits,
} from '@helpers/phoneNumber';

import CountryFlag from './countryFlag';
import PhoneCountrySheet, {PhoneCountrySheetRef} from './phoneCountrySheet';
import PhoneNumberField from './phoneNumberField';
import TextInput from './textinput';

const MAX_PHONE_NUMBER_DIGITS = 15;
const FLAG_BUTTON_HIT_SLOP = {bottom: 8, left: 8, right: 4, top: 8};

type PhoneNumberInputProps = Omit<
  React.ComponentProps<typeof TextInput>,
  | 'value'
  | 'onChangeText'
  | 'InputComponent'
  | 'prefix'
  | 'leadingAccessory'
  | 'icon'
> & {
  value: string;
  onChangeText: (value: string) => void;
  residenceCode?: string;
};

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChangeText,
  residenceCode,
  ...textInputProps
}) => {
  const {t} = useTranslation();
  const countries = usePhoneCountries();
  const sheetRef = useRef<PhoneCountrySheetRef>(null);
  const [parts, setParts] = useState(() =>
    parseStoredPhoneNumber(value, countries, residenceCode),
  );
  const {country, localDigits} = parts;
  const isEditable =
    textInputProps.editable !== false && !textInputProps.disabled;
  const chevronColor = textInputProps.textColor ?? textInputProps.mainColor;

  useEffect(() => {
    setParts(current => {
      const listedCountry = countries.find(
        listed => listed.code === current.country.code,
      );
      const isCurrentValue =
        value === buildPhoneNumber(current.country, current.localDigits);
      if (!isCurrentValue || !listedCountry) {
        return parseStoredPhoneNumber(value, countries, residenceCode);
      }

      return listedCountry === current.country
        ? current
        : {...current, country: listedCountry};
    });
  }, [value, countries, residenceCode]);

  const displayedDigits = formatLocalDigits(country, localDigits);

  const handleChangeText = (text: string) => {
    const typedDigits = toDigits(text);
    const deletedFormattingCharacter =
      typedDigits === localDigits && text.length < displayedDigits.length;
    const nextDigits = deletedFormattingCharacter
      ? typedDigits.slice(0, -1)
      : typedDigits;
    const next = parsePastedNumber(text, countries) ?? {
      country,
      localDigits: nextDigits.slice(
        0,
        MAX_PHONE_NUMBER_DIGITS - country.dialPrefix.length,
      ),
    };
    const isGrowing = next.localDigits.length > localDigits.length;
    if (isGrowing && isTooLong(next)) {
      return;
    }

    setParts(next);
    onChangeText(buildPhoneNumber(next.country, next.localDigits));
  };

  const handleSelectCountry = (selected: PhoneCountry) => {
    setParts({country: selected, localDigits});
    onChangeText(buildPhoneNumber(selected, localDigits));
  };

  const handleOpenCountrySheet = () => sheetRef.current?.present();

  const flagButton = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('phoneInput.selectCountry', {
        defaultValue: 'Select country',
      })}
      accessibilityHint={`${country.name}, ${country.displayPrefix}`}
      accessibilityState={{disabled: !isEditable}}
      disabled={!isEditable}
      hitSlop={FLAG_BUTTON_HIT_SLOP}
      onPress={handleOpenCountrySheet}
      style={styles.flagButton}>
      <CountryFlag code={country.code} size={24} />
      <FontAwesomeIcon
        icon={faChevronDown}
        size={10}
        color={chevronColor}
        style={{color: chevronColor}}
      />
    </Pressable>
  );

  return (
    <>
      <TextInput
        {...textInputProps}
        InputComponent={PhoneNumberField}
        leadingAccessory={flagButton}
        prefix={country.displayPrefix}
        value={displayedDigits}
        onChangeText={handleChangeText}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
      />
      <PhoneCountrySheet
        ref={sheetRef}
        countries={countries}
        selectedCode={country.code}
        onSelect={handleSelectCountry}
      />
    </>
  );
};

const styles = StyleSheet.create({
  flagButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
});

export default PhoneNumberInput;
