import React from 'react';
import {View, StyleSheet} from 'react-native';

import Modal from 'react-native-modal';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/pro-light-svg-icons';
import {useTranslation} from 'react-i18next';

import useTheme from '@hooks/useTheme';
import {Typography, Button} from '@src/components';
import {Theme} from '@styles/styles';

import {ButtonProps} from './button';

interface Props {
  isVisible: boolean;
  title: string;
  type: 'WARNING' | 'INFO';
  body: string;
  bodyTwo: string;
  buttonType: number;
  onContinue: () => void;
  onLogout: () => void;
}

const GenericPopUp: React.FC<Props> = ({
  isVisible,
  title,
  type,
  body,
  bodyTwo,
  buttonType,
  onContinue,
  onLogout,
}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const styles = makeStyles(theme);

  const isWarning = type === 'WARNING';

  const buttons: Record<number, Array<ButtonProps>> = {
    1: [
      {
        variant: 'primary',
        text: t('common.continue'),
        onPress: onContinue,
      },
    ],
    2: [
      {
        text: t('common.continue'),
        onPress: onContinue,
      },
      {
        text: t('common.logOut'),
        onPress: onLogout,
        variant: 'outline',
      },
    ],
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <FontAwesomeIcon
          size={75}
          style={isWarning ? styles.iconWarning : {color: theme.colors.primary}}
          icon={isWarning ? faExclamationTriangle : faInfoCircle}
        />
        <Typography
          textStyle={styles.marginVertical}
          variant="h3"
          fontWeight="bold"
          text={t(title)}
        />
        <View>
          <Typography variant="b1" text={t(body)} />
          <Typography
            variant="b1"
            textStyle={styles.marginVertical}
            text={t(bodyTwo)}
          />
        </View>
        <View style={styles.flexRow}>
          {buttons[buttonType].map(({text, onPress, variant}, index) => (
            <Button
              key={index}
              onPress={onPress}
              variant={variant ?? 'primary'}
              text={text}
              textStyle={
                variant === 'outline'
                  ? {color: theme.colors.primary}
                  : undefined
              }
              buttonStyle={{
                ...(variant === 'outline' ? styles.outlineButton : {}),
                ...styles.marginRight,
              }}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 22,
      paddingVertical: 35,
      alignItems: 'center',
      minHeight: 250,
    },
    marginVertical: {
      marginVertical: 20,
    },
    flexRow: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    iconWarning: {
      color: '#B33A3A',
    },
    colorRed: {
      color: '#B33A3A',
    },
    marginRight: {
      marginRight: 15,
    },
    outlineButton: {
      borderColor: theme.colors.primary,
    },
  });

export default GenericPopUp;
