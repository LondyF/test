import React from 'react';
import {ScrollView, StyleSheet, View, StatusBar} from 'react-native';

import {
  Onfido,
  OnfidoCaptureType,
  OnfidoCountryCode,
  OnfidoDocumentType,
  OnfidoTheme,
} from '@onfido/react-native-sdk';

import {useNavigation} from '@react-navigation/native';

import {PageContainer, Button} from '@components/index';
import {Theme} from '@styles/index';
import useActivateTestMode from '@hooks/useActivateTestMode';

import Logo from '../components/logo';
import useCyclingText from '../hooks/useCyclingText';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const {ActivateTestModeWrapper} = useActivateTestMode();

  const [_, welcomeText] = useCyclingText(
    ['Welkom', 'Welcome', 'Bon Bini', 'Bienvenida', '欢迎'],
    3000,
    {
      variant: 'h1',
      color: Theme.colors.primary,
      align: 'center',
    },
  );

  const [__, description] = useCyclingText(
    [
      'Hello there, Met MiSalu kunt u zich identificeren bij zorgverleners/zorginstellingen op Curacao. Machtigingen worden digitale toestemmingen. Dit in uw eigen taal',
      'With MiSalu you can identify yourself with health care providers / institutions on Curacao. Permissions become digital permissions. This in your own language',
      'Ku miSalú bo por identifiká bo mes serka bo dunadó di servisio di kuido na Kòrsou. Apoderashonnan ta wòrdu approbá digitalmente. Esaki den bo mes lenga.',
      'Con MiSalu puede identificarse con los proveedores / instituciones de atención médica en Curazao. Los permisos se convierten en permisos digitales. Esto en tu propio idioma',
      '通过MiSalu，您可以在库拉索岛上的医疗保健提供者/机构中找到自己的身份。 权限变成数字权限。 用你自己的语言',
    ],
    3000,
    {
      variant: 'b1',
      textStyle: styles.appDescription,
      align: 'center',
    },
  );

  const [___, continueText] = useCyclingText(
    ['Volgende', 'Continue', 'Siguente', 'Seguir', '继续'],
    3000,
    {
      variant: 'b1',
      color: 'white',
      fontWeight: 'bold',
    },
  );

  const startSdk = () =>
    Onfido.start({
      sdkToken:
        'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE3MDk2NTQ4OTYsInBheWxvYWQiOnsiYXBwIjoiOWMxZmRiY2ItYzkzNC00MjViLWI1NzctMmViYTIwYzMxYzBmIiwiYXBwbGljYXRpb25faWQiOiJuZXQuc3FsYXBpdXMuaVNhbHUiLCJjbGllbnRfdXVpZCI6IjkxNzQxOGZiLTg5ZDUtNDkzOC05ZGQxLTRhNWQzMTg2MmZiNiIsImlzX3NhbmRib3giOnRydWUsImlzX3NlbGZfc2VydmljZV90cmlhbCI6ZmFsc2UsImlzX3RyaWFsIjpmYWxzZSwic2FyZGluZV9zZXNzaW9uIjoiZjdhYTAwYjQtODdjOC00YTMwLTg4ZmUtMjg0NTZlYjBjN2ZiIn0sInV1aWQiOiJwbGF0Zm9ybV9zdGF0aWNfYXBpX3Rva2VuX3V1aWQiLCJ1cmxzIjp7ImRldGVjdF9kb2N1bWVudF91cmwiOiJodHRwczovL3Nkay51cy5vbmZpZG8uY29tIiwic3luY191cmwiOiJodHRwczovL3N5bmMub25maWRvLmNvbSIsImhvc3RlZF9zZGtfdXJsIjoiaHR0cHM6Ly9pZC5vbmZpZG8uY29tIiwiYXV0aF91cmwiOiJodHRwczovL2FwaS51cy5vbmZpZG8uY29tIiwib25maWRvX2FwaV91cmwiOiJodHRwczovL2FwaS51cy5vbmZpZG8uY29tIiwidGVsZXBob255X3VybCI6Imh0dHBzOi8vYXBpLnVzLm9uZmlkby5jb20ifX0.MIGHAkIBEAZ7MWsqF2MB5uSB3jcaoISw2fJmA67VvvcEkALvdda1COMjNilGNx4QKNBcKHXixpKMALjWYeV1hU5DeTJPWSICQTKNijSHhr_sGv8zysTgpVcwfeAWn3ZDN763SA2QkCsC5d-_4piHeTaYm8yP-wd2dW7rv9rAn45kj8CiH4PJilYx',
      flowSteps: {
        welcome: true,
        // proofOfAddress: true,
        captureFace: {
          type: OnfidoCaptureType.PHOTO,
        },
        // captureDocument: {
        //   docType: OnfidoDocumentType.DRIVING_LICENCE,
        //   countryCode: OnfidoCountryCode.NLD,
        // },
      },
      theme: OnfidoTheme.AUTOMATIC,
    })
      .then(result => {
        console.log('Onfido result', result);
      })
      .catch((error: any) => {
        console.log(error);
        // throw error;
      });

  return (
    <PageContainer>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <ActivateTestModeWrapper>
          <Logo />
        </ActivateTestModeWrapper>
        <View style={styles.content}>
          {welcomeText}
          {description}
          <Button
            customTextComponent={continueText as JSX.Element}
            buttonStyle={styles.button}
            onPress={() => navigation.navigate('ChooseLanguage')}
            // onPress={startSdk}
            text=""
          />
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 50,
  },
  welcomeText: {
    color: Theme.colors.primary,
    fontSize: 28,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -50,
  },
  appDescription: {
    textAlign: 'center',
    marginVertical: 55,
  },
  button: {
    alignSelf: 'stretch',
  },
});

export default WelcomeScreen;
