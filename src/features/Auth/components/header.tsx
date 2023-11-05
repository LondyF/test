import React from 'react';
import {View, TouchableOpacity, StyleSheet, Linking} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faInfoCircle} from '@fortawesome/pro-light-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import Logo from './logo';

interface HeaderProps {
  variant?: 'white' | 'blue';
}

const Header: React.FC<HeaderProps> = ({variant = 'white'}) => {
  const {goBack} = useNavigation();
  const {t} = useTranslation();

  const handleInfoButtonPressed = async () => {
    try {
      const helpURL = t('register.helpURL');
      const canOpenURL = await Linking.canOpenURL(helpURL);

      if (canOpenURL) {
        Linking.openURL(helpURL);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <FontAwesomeIcon
            color={variant === 'white' ? 'white' : 'black'}
            size={30}
            icon={faAngleLeft}
          />
        </TouchableOpacity>
        <Logo variant={variant} />
        <TouchableOpacity onPress={handleInfoButtonPressed}>
          <FontAwesomeIcon
            color={variant === 'white' ? 'white' : 'black'}
            size={25}
            icon={faInfoCircle}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
});

export default Header;
