import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  CameraView,
  BarcodeScanningResult,
  useCameraPermissions,
} from 'expo-camera';

import Typography from './typography';

export type QRScanEvent = Pick<BarcodeScanningResult, 'data' | 'type'>;

interface QRScannerProps {
  topContent?: JSX.Element | string;
  bottomContent?: JSX.Element | string;
  onScan(e: QRScanEvent): void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  topContent,
  bottomContent,
  onScan,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = React.useState(false);
  const hasPermission = permission?.granted;

  React.useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarcodeScanned = React.useCallback(
    (event: BarcodeScanningResult) => {
      if (hasScanned) {
        return;
      }

      setHasScanned(true);
      onScan(event);
    },
    [hasScanned, onScan],
  );

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        {topContent}
        <Typography
          variant="b1"
          text="Camera permission is required"
          color="white"
        />
        {bottomContent}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {topContent && <View style={styles.topContent}>{topContent}</View>}
      <CameraView
        barcodeScannerSettings={{barcodeTypes: ['qr']}}
        onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
        style={styles.scanner}
      />
      {bottomContent && (
        <View style={styles.bottomContent}>{bottomContent}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContent: {
    padding: 24,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scanner: {
    flex: 1,
  },
  topContent: {
    padding: 24,
  },
});

export default QRScanner;
