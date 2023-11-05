import React from 'react';
import { SafeAreaView, ImageBackground, ViewStyle, StyleSheet } from 'react-native';

import { Theme } from '@styles/index';

interface PageContainerProps {
  children: React.ReactNode;
  variant?: 'blue' | 'gray' | 'purple' | 'green' | 'none';
  style?: ViewStyle;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, style, variant = 'gray' }) => {
  return (
    <ImageBackground
      style={[styles.container, style, { paddingHorizontal: Theme.spacing.horizontalPadding }]}
      source={
        variant === 'blue'
          ? require('@assets/BackgroundBlue.png')
          : variant === 'gray'
          ? require('@assets/BackgroundWhite.png')
          : variant === 'purple'
          ? require('@assets/FatumBackgroundPurple.png')
          : variant === 'green'
          ? require('@assets/EnniaBackground.png')
          : null
      }>
      <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PageContainer;
