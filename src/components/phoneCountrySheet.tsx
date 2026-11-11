import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import {Keyboard, Pressable, StyleSheet, View} from 'react-native';

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {faCheck} from '@fortawesome/pro-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import type {CountryCode} from 'libphonenumber-js';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {PhoneCountry} from '@src/constants';
import {Theme} from '@src/styles';

import CountryFlag from './countryFlag';
import Typography from './typography';

export type PhoneCountrySheetRef = {
  present: () => void;
  dismiss: () => void;
};

type PhoneCountrySheetProps = {
  countries: Array<PhoneCountry>;
  selectedCode: CountryCode;
  onSelect: (country: PhoneCountry) => void;
};

const PhoneCountrySheet = forwardRef<
  PhoneCountrySheetRef,
  PhoneCountrySheetProps
>(({countries, selectedCode, onSelect}, ref) => {
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const {primary} = Theme.colors;
  const modalRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => ({
    present: () => {
      Keyboard.dismiss();
      modalRef.current?.present();
    },
    dismiss: () => modalRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  const handleSelectCountry = (country: PhoneCountry) => {
    onSelect(country);
    modalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing
      backdropComponent={renderBackdrop}>
      <BottomSheetView style={[styles.sheet, {paddingBottom: bottom + 16}]}>
        <Typography
          variant="h4"
          fontWeight="bold"
          text={t('phoneInput.selectCountry', {defaultValue: 'Select country'})}
          textStyle={styles.title}
        />
        {countries.map(country => {
          const isSelected = country.code === selectedCode;

          return (
            <Pressable
              key={country.code}
              accessibilityRole="button"
              accessibilityLabel={`${country.name}, ${country.displayPrefix}`}
              accessibilityState={{selected: isSelected}}
              onPress={() => handleSelectCountry(country)}
              style={styles.row}>
              <CountryFlag code={country.code} size={32} />
              <View style={styles.rowText}>
                <Typography variant="b1" text={country.name} />
                <Typography
                  variant="b2"
                  color="#585858"
                  text={country.displayPrefix}
                />
              </View>
              {isSelected && (
                <FontAwesomeIcon
                  icon={faCheck}
                  size={16}
                  color={primary}
                  style={{color: primary}}
                />
              )}
            </Pressable>
          );
        })}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

PhoneCountrySheet.displayName = 'PhoneCountrySheet';

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 56,
  },
  rowText: {
    flex: 1,
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    marginBottom: 8,
  },
});

export default PhoneCountrySheet;
