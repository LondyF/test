import React from 'react';
import {View, SafeAreaView, Image, StyleSheet} from 'react-native';

import {RouteProp, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Button, Typography} from '@src/components';
import useTheme from '@hooks/useTheme';

import {TransactionResult} from '../identify';
import {INSURERS} from '@src/constants';

interface Props {
  route: RouteProp<{params: {result: TransactionResult}}, 'params'>;
}

const TransactionResultScreen: React.FC<Props> = ({
  route: {
    params: {
      result: {geldig, msg, naam, vzkId},
    },
  },
}) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const {t} = useTranslation();

  const isGeldig = geldig === 'Y';

  const insurerInfo = INSURERS.find(x => x.id === vzkId ?? -1);

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.pageTitleContainer}>
        <Typography
          variant="h1"
          fontWeight="bold"
          text={
            isGeldig
              ? t('transactionResult.success')
              : t('transactionResult.failed')
          }
        />
      </View>
      <View style={styles.successFailedImageContainer}>
        {isGeldig ? (
          <Image source={require('@assets/success.png')} />
        ) : (
          <Image source={require('@assets/failed.png')} />
        )}
        <Typography
          textStyle={styles.insuranceMsg}
          variant="h2"
          fontWeight="bold"
          text={
            isGeldig
              ? t('transactionResult.valid')
              : t('transactionResult.invalid')
          }
        />
        <Typography
          textStyle={styles.insuranceMsg}
          variant="b2"
          fontWeight="bold"
          text={naam}
          color={theme.colors.primary}
        />
        <Typography
          textStyle={styles.insuranceMsg}
          variant="h3"
          color="#A2A1A1"
          fontWeight="bold"
          text={msg}
        />
      </View>
      <View style={styles.logoContainer}>
        <Image style={styles.insuranceLogo} source={insurerInfo!.logo} />
        <Button
          variant="transparent"
          buttonStyle={styles.continueButton}
          textStyle={styles.buttonText}
          onPress={() => navigation.goBack()}
          text={t('common.continue')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  pageTitleContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    borderWidth: 2,
    borderColor: '#1BAB6D',
    paddingLeft: 40,
    paddingRight: 40,
  },
  buttonText: {
    fontSize: 18,
    color: '#1BAB6D',
  },
  insuranceLogo: {
    maxHeight: 200,
    width: 250,
    resizeMode: 'contain',
  },
  logoContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  insuranceMsg: {
    textAlign: 'center',
    marginTop: 20,
  },
  successFailedImageContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransactionResultScreen;
