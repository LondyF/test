import React from 'react';
import {Modal, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';

import {BarCodeReadEvent} from 'react-native-camera';

import {QRScanner, Typography} from '@src/components';

interface ScanQRCodeModalProps {
  isVisisble: boolean;
  onScan: (e: BarCodeReadEvent) => any;
  onCancel: () => void;
}

const ScanQRCodeModal: React.FC<ScanQRCodeModalProps> = ({
  isVisisble,
  onScan,
  onCancel,
}) => {
  return (
    <Modal animationType="slide" visible={isVisisble} transparent={true}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Typography
            align="right"
            variant="b1"
            fontWeight="bold"
            text="cancel"
            color="white"
          />
        </TouchableOpacity>
        <QRScanner
          topContent={
            <Typography variant="h1" text="Scan QR Code" color="white" />
          }
          onScan={onScan}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  cancelButton: {
    padding: 15,
  },
});

export default ScanQRCodeModal;
