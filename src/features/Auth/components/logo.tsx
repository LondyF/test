import React from 'react';
import {Image, StyleSheet} from 'react-native';

interface LogoProps {
  variant?: 'blue' | 'white';
}

const Logo: React.FC<LogoProps> = ({variant = 'blue'}) => {
  return (
    <Image
      style={styles.logo}
      source={
        variant === 'blue'
          ? require('@assets/logo_blauw.png')
          : require('@assets/logo_wit.png')
      }
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 80,
    width: 160,
    resizeMode: 'contain',
  },
});

export default Logo;
