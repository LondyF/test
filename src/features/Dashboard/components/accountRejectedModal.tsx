import React from 'react';
import {StyleSheet, View} from 'react-native';

import Modal from 'react-native-modal';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faExclamationTriangle} from '@fortawesome/pro-light-svg-icons';
import {useTranslation} from 'react-i18next';

import {Button, Typography} from '@src/components';

interface Props {
  isVisible: boolean;
  onContinue: () => void;
  onLogout: () => void;
}

const AccountRejectedModal: React.FC<Props> = ({
  isVisible,
  onContinue,
  onLogout,
}) => {
  const {t} = useTranslation();

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <FontAwesomeIcon
          size={75}
          style={styles.icon}
          icon={faExclamationTriangle}
        />
        <Typography
          textStyle={styles.marginVertical}
          variant="h3"
          fontWeight="bold"
          text={t('dashboard.accountRejected')}
        />
        <View>
          <Typography
            variant="b1"
            text={t('dashboard.accountRejectionExplanation')}
          />
          <Typography
            variant="b1"
            textStyle={styles.marginVertical}
            text={t('dashboard.accountRejectionMistake')}
          />
        </View>
        <View style={styles.flexRow}>
          <Button
            variant="outline"
            text={t('common.logOut')}
            textStyle={styles.colorRed}
            buttonStyle={styles.logoutButton}
            onPress={onLogout}
          />
          <Button
            text={t('common.continue')}
            buttonStyle={styles.backgroundRed}
            onPress={onContinue}
          />
        </View>
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
  marginVertical: {
    marginVertical: 20,
  },
  flexRow: {
    flexDirection: 'row',
  },
  icon: {
    color: '#B33A3A',
  },
  colorRed: {
    color: '#B33A3A',
  },
  logoutButton: {
    borderColor: '#B33A3A',
    marginRight: 15,
  },
  backgroundRed: {
    backgroundColor: '#B33A3A',
  },
});

export default AccountRejectedModal;
