import React from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars, faDownload, faBell} from '@fortawesome/pro-light-svg-icons';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {s} from 'react-native-size-matters';
import {useTranslation} from 'react-i18next';

import useTheme from '@hooks/useTheme';
import {Theme} from '@styles/styles';
import {ValidationStatus} from '@src/types/validationStatus';
import {Typography} from '@src/components';
import {convertISOdateWithTime} from '@utils/utils';

const Header: React.FC<{user: User}> = ({user}) => {
  const {t} = useTranslation();

  var appTheme = useTheme();
  var styles = makeStyles(appTheme);
  const navigation = useNavigation();

  const isAccountRejected = user.validationStatus === ValidationStatus.REJECTED;

  const isAccountValidated =
    user.validationStatus === ValidationStatus.VALIDATED;

  const displayValidationStatus =
    user.validationStatus === ValidationStatus.PENDING || isAccountRejected;

  const isNewerVersionAvailable = user?.device?.needUpdate === 1;

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleDownloadButton = async () => {
    try {
      const platform = Platform.OS;
      const url = t(
        platform === 'ios'
          ? 'dashboard.downloadURL_iOS'
          : 'dashboard.downloadURL_Android',
      );
      const canOpenURL = await Linking.canOpenURL(url);

      if (canOpenURL) {
        Linking.openURL(url);
      }
    } catch (e) {
      Alert.alert('Oops', 'Failed to open URL');
    }
  };

  return (
    <View
      style={[
        styles.headerWrapper,
        displayValidationStatus && styles.headerWrapperExtraSpacing,
      ]}>
      <ImageBackground
        style={styles.headerImage}
        source={require('@assets/DashboardHeader.png')}>
        <View style={styles.openDrawerButtonContainer}>
          <TouchableOpacity
            disabled={!isAccountValidated}
            onPress={openDrawer}
            style={{
              ...styles.openDrawerButton,
              ...(!isAccountValidated && styles.disabled),
            }}>
            <FontAwesomeIcon color="white" size={20} icon={faBars} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.headerContainer}>
        <View style={styles.flexRow}>
          <View>
            <Text style={styles.welcomeText}>{`${t('dashboard.welcome')} ${
              user.firstName
            }!`}</Text>
            <Text style={styles.lastRefreshedText}>
              {`${t('dashboard.lastRefresh')}: ${
                convertISOdateWithTime(user?.device?.LastConnect) ?? 'Unknown'
              }`}
            </Text>

            {isNewerVersionAvailable && (
              <Text style={styles.newUpdateAvailable}>
                {t('dashboard.newUpdateAvailable')}
              </Text>
            )}
          </View>
          <View style={styles.iconContainer}>
            {isNewerVersionAvailable && (
              <TouchableOpacity onPress={handleDownloadButton}>
                <FontAwesomeIcon size={s(23)} icon={faDownload} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              disabled={!isAccountValidated}
              onPress={() => navigation.navigate('Notifications')}>
              <FontAwesomeIcon
                style={styles.bellIcon}
                size={s(23)}
                icon={faBell}
              />
            </TouchableOpacity>
          </View>
        </View>
        {displayValidationStatus && (
          <Typography
            variant="b1"
            color={isAccountRejected ? 'red' : '#0096FF'}
            fontWeight="bold"
            text={
              isAccountRejected
                ? t('dashboard.accountRejected')
                : t('dashboard.awaitingValidation')
            }
            textStyle={styles.validationStatus}
          />
        )}
      </View>
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    headerWrapper: {
      flex: 0.4,
    },
    headerWrapperExtraSpacing: {
      flex: 0.445,
    },
    headerContainer: {
      paddingHorizontal: theme.spacing.horizontalPadding,
      flex: 1,
    },
    flexRow: {
      flexDirection: 'row',
    },
    headerImage: {
      width: '100%',
      resizeMode: 'cover',
      aspectRatio: 961 / 392,
      height: undefined,
    },
    welcomeText: {
      fontSize: 16,
    },
    lastRefreshedText: {
      fontSize: s(11),
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: '#8f8f8f',
    },
    newUpdateAvailable: {
      fontSize: s(11),
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: 'green',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      flex: 1,
    },
    validationStatus: {
      marginTop: 5,
      textTransform: 'uppercase',
    },
    bellIcon: {
      marginLeft: 7,
    },
    openDrawerButtonContainer: {
      paddingHorizontal: theme.spacing.horizontalPadding,
      paddingTop: 30,
    },
    openDrawerButton: {
      width: 55,
      height: 55,
      borderRadius: 55 / 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    disabled: {
      backgroundColor: theme.colors.gray,
    },
  });

export default Header;
