import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import Svg, {Line} from 'react-native-svg';

type DashedSvgLineProps = {
  style?: StyleProp<ViewStyle>;
};

const DashedSvgLine = ({style}: DashedSvgLineProps) => (
  <Svg height="8" width="100%" style={style}>
    <Line
      x1="0"
      y1="5"
      x2="100%"
      y2="5"
      stroke="#DCDCDC"
      strokeWidth="4"
      strokeDasharray="15,10"
    />
  </Svg>
);

export default DashedSvgLine;
