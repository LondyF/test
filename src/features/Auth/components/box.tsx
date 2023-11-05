import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

interface BoxProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Box: React.FC<BoxProps> = ({children, style}) => (
  <View style={[styles.box, style]}>{children}</View>
);

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    padding: 20,
    alignSelf: 'stretch',
  },
});

export default Box;
