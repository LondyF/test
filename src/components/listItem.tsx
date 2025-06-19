import React from 'react';
import {View, ViewStyle} from 'react-native';

import {Theme} from '@src/styles';

interface listItemProps {
  index: number;
  style?: ViewStyle;
  children: React.ReactNode;
}

const ListItem: React.FC<listItemProps> = ({children, index, style}) => {
  const {
    colors: {white, whiteGray},
  } = Theme;

  return (
    <View
      style={[
        {
          backgroundColor: index % 2 === 0 ? whiteGray : white,
        },
        {...style},
      ]}>
      {children}
    </View>
  );
};

export default ListItem;
