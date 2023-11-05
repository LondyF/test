import React, { useCallback, useEffect, useRef } from 'react';

import { Vibration } from 'react-native';
import { Text, Animated, View, StyleSheet, TouchableHighlight } from 'react-native';

import { ToastProps } from './toasts';
import useSetToastType from './useSetToastType';

interface Props extends ToastProps {
  hideToast: () => void;
  index: number;
}

const Toast: React.FC<Props> = ({ message, type, hideToast, duration }) => {
  const { background, icon, title } = useSetToastType(type);
  const styles = makeStyles(background);
  let yValue = useRef(new Animated.Value(0)).current;
  let opacity = useRef(new Animated.Value(0)).current;

  const hideToastAnimation = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      hideToast();
    });
  }, [hideToast, opacity]);

  const showToast = useCallback(() => {
    Vibration.vibrate();
    Animated.parallel([
      Animated.timing(yValue, {
        toValue: 70,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        hideToastAnimation();
      }, duration);
    });
  }, [yValue, opacity, duration, hideToastAnimation]);

  useEffect(() => {
    yValue.setValue(0);
    showToast();
  }, [showToast, yValue]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY: yValue }] }, styles.container]}>
      <TouchableHighlight
        underlayColor={'#FFFFFF'}
        onPress={() => hideToastAnimation()}
        style={styles.toasterBox}>
        <React.Fragment>
          <View>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
          </View>
          <View style={styles.flex}>
            <Text style={styles.title}>{title} </Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          <View style={styles.closeIconContainer}>
            <Text style={styles.closeIcon}>&#10007;</Text>
          </View>
        </React.Fragment>
      </TouchableHighlight>
    </Animated.View>
  );
};

const makeStyles = (background: string) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      left: 0,
      right: 0,
      position: 'absolute',
      top: 0,
      paddingHorizontal: 25,
    },
    toasterBox: {
      backgroundColor: 'white',
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderTopColor: '#DEDEDE',
      borderBottomColor: '#DEDEDE',
      borderRightColor: '#DEDEDE',
      borderWidth: 1,
      borderLeftWidth: 5,
      borderRadius: 4,
      borderLeftColor: background,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 3,
    },
    message: {
      fontSize: 15,
      color: '#757575',
    },
    iconContainer: {
      width: 35,
      marginRight: 15,
      height: 35,
      borderRadius: 35 / 2,
      backgroundColor: background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      fontSize: 23,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    closeIconContainer: {
      marginLeft: 'auto',
      alignSelf: 'flex-start',
    },
    closeIcon: {
      fontSize: 20,
      color: '#b8b8b8',
      fontWeight: 'bold',
    },
  });

export default React.memo(Toast, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
});
