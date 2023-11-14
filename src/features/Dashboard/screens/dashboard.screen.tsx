import React, {useEffect, useState} from 'react';
import {View, ImageBackground, StyleSheet, Image, Text} from 'react-native';

import {useTranslation} from 'react-i18next';
import {vs} from 'react-native-size-matters';
import {ScrollView} from 'react-native-gesture-handler';
import {
  faIdCard,
  faUsers,
  faPrescriptionBottleAlt,
  faVial,
  faHospital,
  faSyringe,
  faCalendarAlt,
  faEnvelope,
} from '@fortawesome/pro-light-svg-icons';
import {NavigationProp} from '@react-navigation/core';

import useAuthStore from '@stores/useAuthStore';
import useGenericPopUpStore from '@stores/useGenericPopUpStore';
import useTheme from '@hooks/useTheme';
import {Theme} from '@styles/styles';
import {GenericPopUp} from '@src/components';

import QuickNavItem from '../components/quickNavItem';
import Header from '../components/header';
import ChangePasswordModal from '../components/changePasswordModal';
import BotikaNaWarda from '../components/botikaNawarda';
import {NavItem} from '../dashboard';
import {INSURERS} from '@src/constants';
import {SafeAreaView} from 'react-native-safe-area-context';

const DashboardScreen: React.FC<{navigation: NavigationProp<any, string>}> = ({
  navigation: {navigate},
}) => {
  const {t} = useTranslation();
  const [user, logoutUser, redirectSettings, clearRedirectionSettings] =
    useAuthStore(state => [
      state.user,
      state.resetAuthentication,
      state.redirectSettings,
      state.clearRedirectionSettings,
    ]);
  const [
    popUpTitle,
    popUpBody,
    popUpBodyTwo,
    popUpVisible,
    popUpType,
    setPopUpVisibility,
    buttonType,
  ] = useGenericPopUpStore(state => [
    state.popUpTitle,
    state.popUpBody,
    state.popUpBodyTwo,
    state.isPopUpVisible,
    state.popUpType,
    state.setPopUpVisibility,
    state.buttonType,
  ]);

  const appTheme = useTheme();
  const styles = makeStyles(appTheme);

  //deleteCacheFolder();

  const userInsurance = INSURERS.find(x => x.id === user?.vzkId);

  console.log(user);

  const [isChangePasswordModalOpen, setisChangePasswordModalOpen] =
    useState(false);

  const NavItems: Array<NavItem> = [
    {
      title: t('dashboard.identify'),
      action: () => navigate('Identify'),
      icon: faIdCard,
      requireValidation: false,
    },
    {
      title: t('dashboard.mandansa'),
      action: () => navigate('AllMandansas'),
      icon: faUsers,
      requireValidation: true,
    },
    {
      title: t('dashboard.prescriptions'),
      action: () => navigate('Prescriptions'),
      icon: faPrescriptionBottleAlt,
      requireValidation: true,
    },
    {
      title: t('dashboard.labRequests'),
      action: () => navigate('LabRequests'),
      icon: faVial,
      requireValidation: true,
    },
    {
      title: t('dashboard.myDoctorReferrals'),
      action: () => navigate('AllReferrals'),
      icon: faEnvelope,
      requireValidation: true,
    },
    {
      title: t('dashboard.myAppointments'),
      action: () => navigate('AllAppointments'),
      icon: faCalendarAlt,
      requireValidation: true,
    },
    {
      title: t('dashboard.pharmacies'),
      action: () => navigate('AllPharmacies'),
      icon: faHospital,
      requireValidation: false,
    },
    {
      title: t('dashboard.prickPost'),
      action: () => navigate('AllLabs'),
      icon: faSyringe,
      requireValidation: false,
    },
  ];

  const isJSONString = (jsonString?: string | number) => {
    try {
      //@ts-ignore: Still W.I.P
      const result = JSON.parse(jsonString ?? '');

      if (!result || typeof result !== 'object') {
        throw Error();
      }

      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const hasToRedirect = Object.keys(redirectSettings).length !== 0;

    if (hasToRedirect && redirectSettings.pageKey) {
      const isAdditionalDataJSON = isJSONString(
        redirectSettings.additionalData,
      );
      const params = isAdditionalDataJSON
        ? JSON.parse(redirectSettings!.additionalData as string)
        : Number(redirectSettings.additionalData);

      navigate(redirectSettings.pageKey, !!params && params);
      clearRedirectionSettings();
    }
  }, [redirectSettings, clearRedirectionSettings, navigate]);

  return (
    <>
      <ChangePasswordModal
        isVisible={isChangePasswordModalOpen}
        changePasswordPressed={() => {
          navigate('ChangePassword');
          setisChangePasswordModalOpen(false);
        }}
        cancelPressed={() => {
          setisChangePasswordModalOpen(false);
        }}
      />
      {/**/}
      {/* <GenericPopUp */}
      {/*   title={popUpTitle} */}
      {/*   body={popUpBody} */}
      {/*   bodyTwo={popUpBodyTwo} */}
      {/*   isVisible={popUpVisible} */}
      {/*   type={popUpType} */}
      {/*   buttonType={buttonType} */}
      {/*   onContinue={() => setPopUpVisibility(false)} */}
      {/*   onLogout={() => { */}
      {/*     setPopUpVisibility(false); */}
      {/*     logoutUser(); */}
      {/*   }} */}
      {/* /> */}
      {/**/}
      <ImageBackground
        style={styles.flex}
        source={require('@assets/BackgroundWhite.png')}>
        <SafeAreaView edges={['right', 'top', 'left']} style={styles.flex}>
          {/* <Header user={user!} /> */}
          <View style={styles.scrollViewContainer}>
            <ScrollView style={styles.mainContianer}>
              <View style={styles.quickNavContainer}>
                {NavItems.map(navItem => (
                  <QuickNavItem key={navItem.title} user={user!} {...navItem} />
                ))}
              </View>
              <BotikaNaWarda />
            </ScrollView>
          </View>
        </SafeAreaView>
        <View style={styles.bannerContainer}>
          <Image source={userInsurance!.banner} style={styles.banner} />
        </View>
      </ImageBackground>
    </>
  );
};

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    headerWrapper: {
      flex: vs(0.35),
    },
    quickNavContainer: {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    },
    scrollViewContainer: {
      flex: vs(0.68),
    },
    mainContianer: {
      paddingHorizontal: theme.spacing.horizontalPadding,
      flex: 0.2,
    },
    banner: {
      resizeMode: 'contain',
      width: '100%',
      flex: 1,
      padding: 0,
    },
    bannerContainer: {
      flex: 0.1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginBottom: -7,
    },
  });
};

export default DashboardScreen;
