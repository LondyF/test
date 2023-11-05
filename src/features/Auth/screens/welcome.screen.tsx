import React from 'react';
import {ScrollView, StyleSheet, View, StatusBar} from 'react-native';

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
