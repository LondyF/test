import React from 'react';
import {} from 'react-native';

import {BarCodeReadEvent} from 'react-native-camera';

import {QRScanner} from '@src/components';

interface QRScannerProps {
  topContent: JSX.Element | string;
  bottomContent: JSX.Element | string;
  onScan(e: BarCodeReadEvent): void;
}

const QRScannerScreen: React.FC<QRScannerProps> = ({
  topContent,
  bottomContent,
  onScan,
}) => {
  return (
    <QRScanner
      topContent={topContent}
      bottomContent={bottomContent}
      onScan={onScan}
    />
  );
};

export default QRScannerScreen;
