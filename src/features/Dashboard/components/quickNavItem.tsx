import React from 'react';
import {StyleSheet, Text, TouchableOpacityProps} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {s, vs, ms} from 'react-native-size-matters';

import useTheme from '@hooks/useTheme';
import {Theme} from '@styles/styles';

import {NavItem} from '../dashboard';
import {ValidationStatus} from '@src/types/validationStatus';

type Props = NavItem &
  TouchableOpacityProps & {
    user: User;
  };

const isValidated = (fn: Function) => {
  return fn();
};

const QuickNavItem: React.FC<Props> = ({
  title,
  icon,
  requireValidation,
  user,
  action,
}) => {
  const appTheme = useTheme();
  const styles = makeStyles(appTheme);

  const isUserValidated = user.validationStatus === ValidationStatus.VALIDATED;
  const isUserRejected = user.validationStatus === ValidationStatus.REJECTED;

  const isDisabled =
    (requireValidation && !isUserValidated) ||
    isUserRejected ||
    user.optOut === 1;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={() => isValidated(action)}
      style={[styles.container, isDisabled && styles.disabled]}>
      <>
        <FontAwesomeIcon size={ms(60, 1.2)} style={styles.icon} icon={icon} />
        <Text style={styles.title}>{title}</Text>
      </>
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: vs(12),
      width: s(145),
      height: vs(113),
      backgroundColor: 'white',
      borderColor: theme.colors.lightGray,
      borderWidth: 1,
      borderRadius: 5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      color: theme.colors.primary,
    },
    title: {
      fontSize: s(15),
      marginTop: vs(8),
    },
    disabled: {
      backgroundColor: '#e8e8e8',
    },
  });

export default QuickNavItem;
