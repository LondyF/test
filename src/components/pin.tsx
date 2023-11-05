import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Vibration } from 'react-native';
import Typography from './typography';

interface PinProps {
  onPinError: () => void;
  onPinSuccess: () => void;
  pinValidator: (pin: Array<string>) => Boolean;
}

const Pin: React.FC<PinProps> = ({ onPinError, onPinSuccess, pinValidator }) => {
  const pinLength = 4;
  const numbers: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '<-'];
  const translateX = useRef(new Animated.Value(0)).current;

  const [enteredPin, setEnteredPin] = useState(['-', '-', '-', '-']);
  const [currentIndex, setCurrentIndex] = useState(0);

  const clearPin = () => {
    setEnteredPin(['-', '-', '-', '-']);
    setCurrentIndex(0);
  };

  const shakeView = () => {
    Vibration.vibrate();
    Animated.sequence([
      Animated.timing(translateX, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const validatePin = (pin: Array<string>) => {
    if (pinValidator(pin)) {
      onPinSuccess();
    } else {
      onPinError();
      shakeView();
    }

    clearPin();
  };

  const handleNumberPressed = (num: string) => {
    const newPin = [...enteredPin];

    // Only continue if we haven't reached the max amount of pins that can be entered.
    if (currentIndex <= pinLength - 1) {
      newPin[currentIndex] = num.toString();

      setCurrentIndex((index) => index + 1);
      setEnteredPin(newPin);
    }

    // We've reached the max amount of numbers that can be entered so we can validate
    if (currentIndex + 1 === pinLength) {
      return validatePin(newPin);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      return;
    }
    const newPin = [...enteredPin];
    newPin[currentIndex - 1] = '-';

    setCurrentIndex((index) => index - 1);
    setEnteredPin(newPin);
  };

  const isCurrentIndex = (index: number) => index === currentIndex;

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      <View style={styles.enteredPinContainer}>
        {enteredPin.map((item, index) => (
          <View
            key={index}
            style={[styles.pinItem, isCurrentIndex(index) ? styles.activePinItem : null]}>
            <Typography
              variant="h2"
              fontWeight="bold"
              color={isCurrentIndex(index) ? 'black' : 'white'}
              text={item}
            />
          </View>
        ))}
      </View>
      <View style={styles.numPad}>
        {numbers.map((number, index) => (
          <TouchableOpacity
            key={index}
            style={styles.numPadItem}
            onPress={() => {
              if (number !== '') {
                number === '<-' ? handleBack() : handleNumberPressed(number as string);
              }
            }}>
            <Typography variant="h3" fontWeight="bold" text={number} color="white" />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  enteredPinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'white',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 15,
  },
  pinItem: {
    backgroundColor: '#73b0e1',
    paddingHorizontal: 20,
    paddingVertical: 12.5,
    borderRadius: 10,
  },
  activePinItem: {
    backgroundColor: 'white',
  },
  pinItemText: {
    fontSize: 30,
    color: 'white',
  },
  activePinItemText: {
    color: 'black',
  },
  numPad: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  numPadItem: {
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
});

export default Pin;
