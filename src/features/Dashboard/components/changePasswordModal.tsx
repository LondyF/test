import React from 'react';
import {View, StyleSheet} from 'react-native';

import Modal from 'react-native-modal';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faExclamationTriangle} from '@fortawesome/pro-light-svg-icons';

import useTheme from '@hooks/useTheme';
import {Typography, Button} from '@src/components';

interface Props {
  isVisible: boolean;
  changePasswordPressed: () => void;
  cancelPressed: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({
  isVisible,
  changePasswordPressed,
  cancelPressed,
}) => {
  const theme = useTheme();

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <FontAwesomeIcon
          color={theme.colors.primary}
          size={75}
          style={styles.icon}
          icon={faExclamationTriangle}
        />
        <Typography
          textStyle={styles.marginVertical}
          variant="h3"
          fontWeight="bold"
          text={'Action Required'}
        />
        <Typography
          variant="b1"
          align="center"
          text="Due to security reasons we recommend you changing your password.
          This password will be your new password to access your MiSalu account."
        />
        <Button
          variant="primary"
          buttonStyle={styles.changePasswordButton}
          text="Change password"
          onPress={changePasswordPressed}
        />
        <Button
          variant="transparent"
          textStyle={styles.remindMeLaterButton}
          text="remind me later"
          onPress={cancelPressed}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 22,
    paddingVertical: 35,
    alignItems: 'center',
    minHeight: 250,
  },
  icon: {
    color: '#B33A3A',
  },
  changePasswordButton: {
    marginTop: 25,
    marginBottom: 5,
  },
  remindMeLaterButton: {
    color: 'black',
  },
  marginVertical: {
    marginVertical: 20,
  },
});

export default ChangePasswordModal;
