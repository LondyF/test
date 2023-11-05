import React from 'react';

import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import {faPlusCircle} from '@fortawesome/pro-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import useTheme from '@src/hooks/useTheme';
import {Theme} from '@src/styles/styles';

interface IProps extends ViewProps {
  onPress?: () => void;
  image?: string;
}

const AddImageViewBorder: React.FC<IProps> = ({style, onPress, image}) => {
  const appTheme = useTheme();
  const styles = makeStyles(appTheme);

  return (
    <TouchableOpacity
      onPress={onPress !== undefined ? onPress : () => {}}
      style={{...(style as ViewStyle)}}>
      <View style={styles.ImageViewborder}>
        {!image ? (
          <FontAwesomeIcon
            icon={faPlusCircle}
            color={appTheme.colors.primary}
            size={40}
          />
        ) : (
          <Image style={styles.image} source={{uri: image}} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    ImageViewborder: {
      borderColor: theme.colors.primary,
      borderWidth: 2.5,
      width: '100%',
      height: '100%',
      borderRadius: 5,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 5,
    },
  });

export default AddImageViewBorder;
