import React from 'react';
import {View, StyleSheet} from 'react-native';

import {useTranslation} from 'react-i18next';

import {Typography, Pin} from '@components/index';

interface EnterPinStepProps {
  onPinError: () => void;
  onPinSuccess: () => void;
  pinValidator: (pin: string[]) => Boolean;
}

const EnterPinStep: React.FC<EnterPinStepProps> = ({
  onPinError,
  onPinSuccess,
  pinValidator,
}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Typography
        variant="b1"
        fontWeight="bold"
        align="center"
        color="white"
        text={t('register.setPinDesc')}
      />
      <View style={styles.numPadContainer}>
        <Typography
          variant="b1"
          fontWeight="bold"
          align="center"
          color="white"
          text={t('register.enterPin')}
        />
        <Pin
          onPinError={onPinError}
          onPinSuccess={onPinSuccess}
          pinValidator={pinValidator}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 50,
  },
  numPadContainer: {
    paddingHorizontal: 30,
    marginTop: 50,
  },
});

export default EnterPinStep;
