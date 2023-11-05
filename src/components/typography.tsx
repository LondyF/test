import React from 'react';
import { Text, ColorValue, TextStyle, TextProps } from 'react-native';

import { Theme } from '@styles/index';
import { FontVariant } from '@src/styles/styles';

export interface TypographyProps extends TextProps {
  variant: FontVariant;
  text: String;
  color?: ColorValue;
  textStyle?: TextStyle;
  fontWeight?: TextStyle['fontWeight'];
  align?: TextStyle['textAlign'];
  fontSize?: TextStyle['fontSize'];
  lineHeight?: TextStyle['lineHeight'];
  fontStyle?: TextStyle['fontStyle'];
}

const getStyleByVariant = (variant: FontVariant) => {
  return Theme.typography[variant];
};

const Typography: React.FC<TypographyProps> = ({
  variant = 'b1',
  text,
  fontSize = null,
  color = 'black',
  fontStyle = 'normal',
  textStyle,
  fontWeight,
  align,
  ...props
}) => {
  const style = getStyleByVariant(variant);

  return (
    <Text
      {...props}
      style={[
        style,
        {
          fontSize: fontSize ?? style.fontSize,
          color,
          fontStyle,
          fontWeight,
          textAlign: align,
          ...textStyle,
        },
      ]}>
      {text}
    </Text>
  );
};

export default Typography;
