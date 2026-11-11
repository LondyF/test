import React from 'react';
import {StyleSheet, View} from 'react-native';

import {faGlobe} from '@fortawesome/pro-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import * as FLAGS from 'country-flag-icons/string/1x1';
import type {CountryCode} from 'libphonenumber-js';
import {SvgXml} from 'react-native-svg';

const FLAG_SVGS: Partial<Record<string, string>> = FLAGS;
const GLOBE_COLOR = '#585858';

type CountryFlagProps = {
  code: CountryCode;
  size?: number;
};

const CountryFlag: React.FC<CountryFlagProps> = ({code, size = 24}) => {
  const flagXml = FLAG_SVGS[code];
  const circleStyle = {
    borderRadius: size / 2,
    height: size,
    width: size,
  };

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.circle, circleStyle]}>
      {flagXml ? (
        <SvgXml xml={flagXml} width={size} height={size} />
      ) : (
        <FontAwesomeIcon
          icon={faGlobe}
          size={size * 0.6}
          color={GLOBE_COLOR}
          style={{color: GLOBE_COLOR}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default CountryFlag;
