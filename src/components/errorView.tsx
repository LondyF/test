import React from 'react';
import { View, StyleSheet } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSadTear } from '@fortawesome/pro-light-svg-icons';

import { Theme } from '@src/styles';
import { ItemNotInCache } from '@src/helpers/cache';

import { Typography, Button } from './';

interface ErrorViewProps {
  reload: () => void;
  goBack: () => void;
  error: any;
}

const ErrorView: React.FC<ErrorViewProps> = ({ reload, goBack, error }) => {
  const isCacheError = (a: any) => a instanceof ItemNotInCache;

  return (
    <View style={styles.container}>
      <FontAwesomeIcon color={Theme.colors.primary} size={125} icon={faSadTear} />
      <Typography
        textStyle={styles.title}
        variant="h2"
        fontWeight="bold"
        align="center"
        text="We're sorry!"
      />
      <Typography
        variant="h4"
        color="#A2A1A1"
        align="center"
        textStyle={styles.description}
        text={
          isCacheError(error)
            ? "We couldn't load these items. Please get an internet connection and try again!"
            : 'Sorry, something went wrong loading these items! Please try again later!'
        }
      />
      <Button
        buttonStyle={styles.reloadButton}
        variant="primary"
        text="Try to reload"
        onPress={reload}
      />
      <Button variant="transparent" textStyle={styles.black} onPress={goBack} text="Go back" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    paddingVertical: Theme.spacing.verticalPadding,
    paddingHorizontal: Theme.spacing.horizontalPadding,
  },
  title: {
    marginTop: 50,
  },
  description: {
    marginTop: 15,
    marginBottom: 50,
  },
  reloadButton: {
    marginBottom: 25,
  },
  black: {
    color: 'black',
  },
});

export default ErrorView;
