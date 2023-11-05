import React from 'react';
import { StyleSheet, TouchableHighlightProps, TouchableHighlight } from 'react-native';

import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { primaryBlue } from '@src/styles/colors';

const InfoButton: React.FC<TouchableHighlightProps> = ({ ...props }) => {
  return (
    <TouchableHighlight {...props} style={[props.style, styles.container]}>
      <FontAwesomeIcon color={primaryBlue} size={23} icon={faInfoCircle} />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default InfoButton;
