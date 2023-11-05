import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';

import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

import {Typography} from '@components/index';
import {Theme} from '@styles/styles';

interface TikkieRequestModalProps {
  theme: Theme;
  isVisible: boolean;
  requestingUser: User;
  onAccept: () => void;
  onReject: () => void;
}

const TikkieRequestModal: React.FC<TikkieRequestModalProps> = ({
  theme,
  isVisible,
  requestingUser,
  onAccept,
  onReject,
}) => {
  const {t} = useTranslation();

  const styles = makeStyles(theme);

  const acceptButton = (
    <TouchableOpacity
      onPress={onAccept}
      style={[styles.alignCenter, styles.acceptButtonContainer]}>
      <View style={styles.acceptButton}>
        <Typography
          textStyle={styles.acceptButtonText}
          fontWeight="bold"
          variant="h2"
          text={'\u2713'}
        />
      </View>
      <Typography
        fontStyle="italic"
        variant="b2"
        text={t('mandansaAuthorizedReps.accept')}
      />
    </TouchableOpacity>
  );

  const rejectButton = (
    <TouchableOpacity onPress={onReject} style={styles.alignCenter}>
      <View style={styles.rejectButton}>
        <Typography
          textStyle={styles.rejectButtonText}
          fontWeight="bold"
          variant="h2"
          text={'\u00D7'}
        />
      </View>
      <Typography
        fontStyle="italic"
        variant="b2"
        text={t('mandansaAuthorizedReps.reject')}
      />
    </TouchableOpacity>
  );

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.profilePicContainer}>
          <Image
            style={styles.profilePic}
            source={{uri: requestingUser.foto}}
          />
        </View>
        <Typography
          textStyle={styles.incomingRequest}
          variant="b2"
          color={theme.colors.darkGray}
          text={t('mandansaAuthorizedReps.incomingRequest')}
        />
        <Typography
          textStyle={styles.requestingUserName}
          variant="h3"
          fontWeight="bold"
          text={requestingUser.naam}
        />
        <View style={styles.flexRow}>
          {acceptButton}
          {rejectButton}
        </View>
      </View>
      <View />
    </Modal>
  );
};

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 22,
      minHeight: 250,
      alignItems: 'center',
    },
    flexRow: {
      flexDirection: 'row',
    },
    alignCenter: {
      alignItems: 'center',
    },
    profilePicContainer: {
      width: 100,
      height: 100,
      borderWidth: 1,
      borderColor: theme.colors.lightGray,
      borderRadius: 50,
      shadowColor: '#000',
      overflow: 'hidden',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profilePic: {
      width: 90,
      height: 90,
      borderRadius: 45,
    },
    incomingRequest: {
      marginVertical: 25,
    },
    requestingUserName: {
      marginBottom: 25,
    },
    rejectButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderColor: theme.colors.primary,
      borderWidth: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rejectButtonText: {
      color: theme.colors.primary,
    },
    acceptButtonContainer: {
      marginRight: 15,
    },
    acceptButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    acceptButtonText: {
      color: 'white',
    },
  });
};

export default React.memo(TikkieRequestModal);
