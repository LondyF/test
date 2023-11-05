import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { RouteProp } from '@react-navigation/native';

import usePinStore from '@src/stores/usePinStore';

import { PageContainer, Typography, Pin } from './';

interface PinViewProps {
  route: RouteProp<
    { params: { onPinError: any; onPinSuccess: any; onCancel: any; pinValidator: any } },
    'params'
  >;
}

const PinView: React.FC<PinViewProps> = ({
  route: {
    params: { onPinError, onPinSuccess, onCancel, pinValidator },
  },
}) => {
  const pinTitle = usePinStore((state) => state.pinTitle);

  return (
    <PageContainer variant="blue">
      <TouchableOpacity style={styles.cancelButtonContainer} onPress={onCancel}>
        <Typography align="right" variant="b1" fontWeight="bold" text="cancel" color="white" />
      </TouchableOpacity>
      <View style={styles.numPadContainer}>
        <Typography
          variant="b1"
          textStyle={styles.title}
          color="white"
          fontWeight="bold"
          text={pinTitle}
        />
        <Pin onPinError={onPinError} onPinSuccess={onPinSuccess} pinValidator={pinValidator} />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  numPadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  title: {
    marginBottom: 20,
  },
});

export default PinView;
