import React from 'react';

import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

interface QRScannerProps {
  topContent?: JSX.Element | string;
  bottomContent?: JSX.Element | string;
  onScan(e: BarCodeReadEvent): void;
}

const QRScanner: React.FC<QRScannerProps> = ({ topContent, bottomContent, onScan }) => {
  return (
    <QRCodeScanner
      fadeIn={false}
      onRead={onScan}
      topContent={topContent}
      bottomContent={bottomContent}
    />
  );
};

export default QRScanner;
