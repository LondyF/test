import {decimalToHex} from '@src/utils';
import {TransactionTypes} from '@src/constants';
import crypto from 'react-native-quick-crypto';
import {Buffer} from '@craftzdog/react-native-buffer';
import Config from '../config';

const getRequiredConfigValue = (
  value: string | undefined,
  configKey: string,
) => {
  if (!value) {
    throw new Error(`${configKey} is not configured`);
  }

  return value;
};

export default class AES {
  constructor() {}

  encrypt(data: string, base64Key: string) {
    const iv = crypto.randomBytes(12);
    const keyBytes = Buffer.from(base64Key, 'base64');
    const cipher = crypto.createCipheriv('aes-128-gcm', keyBytes as any, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8') as any,
      cipher.final() as any,
    ]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([iv as any, encrypted, tag as any]).toString('base64');
  }

  encry(data: string, base64Key: string, ivBase64: string) {
    var key = Buffer.from(base64Key, 'base64');
    var iv = Buffer.from(ivBase64, 'base64');

    var cipher = crypto.createCipheriv('aes-128-cbc', key as any, iv as any);
    let cip = cipher.update(data, 'utf8', 'base64') as string;
    cip += cipher.final('base64') as string;

    return cip;
  }

  // decrypt(base64Data: string, base64Key: string) {
  //   const dataBytes = Buffer.from(base64Data, 'base64');
  //   const keyBytes = Buffer.from(base64Key, 'base64');
  //   const iv = dataBytes.slice(0, 16);
  //   const text = dataBytes.slice(iv.length, dataBytes.length);

  //   const decipher = crypto.createDecipheriv('aes-128-cbc', keyBytes, iv);

  //   // decipher.setAutoPadding(false);

  //   let decrypted = decipher.update(text.toString('base'), 'base64');
  //   let result = (decrypted += decipher.final('utf-8'));

  //   return result;
  // }

  decrypt(base64Data: string, base64Key: string) {
    const dataBytes = Buffer.from(base64Data, 'base64');
    const keyBytes = Buffer.from(base64Key, 'base64');
    const iv = dataBytes.slice(0, 12);
    const tag = dataBytes.slice(dataBytes.length - 16);
    const text = dataBytes.slice(12, dataBytes.length - 16);
    const decipher = crypto.createDecipheriv('aes-128-gcm', keyBytes, iv);

    decipher.setAuthTag(tag);

    return Buffer.concat([
      decipher.update(text) as any,
      decipher.final() as any,
    ]).toString('utf8');
  }

  generateNonce() {
    var now = new Date();
    var time = Math.round(
      (now.getTime() - new Date(1970, 1, 1).getTime()) / 1000,
    );
    return time.toString() + '00000000000000';
  }

  generateRandomTransactionId() {
    return Math.floor(Math.random() * 90000) + 10000;
  }

  generateQr = (
    nonce: string,
    ownerId: number,
    alternativeData: number,
    transactionId: number,
    flag: number,
    transactionType: number,
    mdsId: number = 0,
    reserved: number = 0,
  ) => {
    const encryptionKey = getRequiredConfigValue(
      Config.ENCRYPTION_KEY,
      'ENCRYPTION_KEY',
    );
    const encryptionMagic = getRequiredConfigValue(
      Config.ENCRYPTION_MAGIC,
      'ENCRYPTION_MAGIC',
    );
    const encryptionVersion = getRequiredConfigValue(
      Config.ENCRYPTION_VERSION,
      'ENCRYPTION_VERSION',
    );

    var magic = Buffer.from(encryptionMagic).toString('hex');
    var version = Buffer.from(encryptionVersion, 'hex').toString('hex');

    var _ownerId = decimalToHex(ownerId, 16);
    var _mdsId = decimalToHex(mdsId, 8);
    var _alternativeData = decimalToHex(alternativeData, 8);
    var _transactionId = decimalToHex(transactionId, 6);
    var _flag = decimalToHex(flag, 2);
    var _transactionType = decimalToHex(transactionType, 2);
    var _reserved = decimalToHex(reserved, 10);

    var hexString =
      _ownerId +
      _mdsId +
      _alternativeData +
      _transactionId +
      _flag +
      _transactionType +
      _reserved +
      magic +
      version;

    const cipher = crypto.createCipheriv(
      'aes-128-gcm',
      Buffer.from(encryptionKey, 'hex'),
      Buffer.from(nonce, 'hex'),
    );

    let ciphertext = cipher.update(hexString, 'hex', 'hex');
    ciphertext += cipher.final('hex');

    var qr = nonce + ciphertext + cipher.getAuthTag().toString('hex');

    return {qr, transactionId};
  };

  generateDigitalSignatureQr = (ownerId: number) =>
    this.generateQr(
      this.generateNonce(),
      ownerId,
      0,
      0,
      0,
      TransactionTypes.DigitaleHandtekening,
      0,
      0,
    );
}
