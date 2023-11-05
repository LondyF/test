import React from 'react';
import { Text, ActivityIndicator, ColorValue, View, StyleSheet, ViewStyle } from 'react-native';

interface LoaderProps {
  text: string;
  isLoading?: boolean;
  indicatorColor?: ColorValue;
  textColor?: ColorValue;
  containerStyle?: ViewStyle;
}

const Loader: React.FC<LoaderProps> = ({
  text,
  containerStyle,
  indicatorColor = 'white',
  textColor = 'white',
  isLoading = true,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.textStyle, { color: textColor }]}>{text}</Text>
      <ActivityIndicator animating={isLoading} color={indicatorColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textStyle: {
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Loader;
