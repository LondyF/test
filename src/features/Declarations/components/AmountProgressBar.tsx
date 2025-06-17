import {Typography} from '@src/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type AmountProgressBarProps = {
  totalAmount: number;
  currentAmount: number;
};

const AmountProgressBar = ({
  currentAmount,
  totalAmount,
}: AmountProgressBarProps) => {
  const flex = currentAmount / totalAmount;

  return (
    <View
      style={{
        width: '100%',
        borderRadius: 5,
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 30,
        gap: 3,
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'green',
          position: 'relative',
        }}>
        <Typography
          variant="b1"
          text="22222"
          color={'blue'}
          textStyle={{
            position: 'absolute',
            left: '50%',
            top: -20,
            color: 'white',
            transform: [{translateX: -20}],
            width: 1002,
          }}
        />
        <View
          style={{
            width: 1,
            height: 16,
            backgroundColor: 'white',
          }}
        />
      </View>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#50329F', '#B89DFE']}
        style={{
          flex: 1,

          height: 12,
          borderRadius: 6,
        }}
      />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'green',
          position: 'relative',
        }}>
        <Typography
          variant="b1"
          text="1222"
          color={'blue'}
          textStyle={{
            position: 'absolute',
            left: '50%',
            top: -20,
            color: 'white',
            transform: [{translateX: -20}],
            width: 1002,
          }}
        />
        <View
          style={{
            width: 1,
            height: 16,
            backgroundColor: 'white',
          }}
        />
      </View>
      <View
        style={{
          flex: 1 - flex,
          height: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.55)',
          borderRadius: 6,
        }}
      />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'green',
          position: 'relative',
        }}>
        <Typography
          variant="b1"
          text="1222"
          color={'blue'}
          textStyle={{
            position: 'absolute',
            left: '50%',
            top: -20,
            color: 'white',
            transform: [{translateX: -20}],
            width: 1002,
          }}
        />
        <View
          style={{
            width: 1,
            height: 16,
            backgroundColor: 'white',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default AmountProgressBar;
