import crypto from 'crypto';
import * as Keychain from 'react-native-keychain';
import AES from '@helpers/AES';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

const ENCYPTION_KEY_ID = 'ENCRYPTION_KEY';
const IOS_HARDCODED_BASE64_KEY = 'MTIzNDU2Nzg5MGFiY2RlZg==';

const AESEncryption = new AES();

export default class SecureStorage {
  static async _getEncryptionKey() {
    if (Platform.OS === 'ios') {
      const iosVersionNumber =
        typeof Platform.Version === 'string'
          ? parseFloat(Platform.Version)
          : Platform.Version;

      if (iosVersionNumber >= 26) {
        return IOS_HARDCODED_BASE64_KEY;
      }
    }

    const hasExistingCreds = await Keychain.getGenericPassword();

    if (hasExistingCreds && hasExistingCreds.username === ENCYPTION_KEY_ID) {
      return hasExistingCreds.password;
    }

    const randomBytes = crypto.randomBytes(16);

    const randomBytesString = Buffer.from(randomBytes).toString('base64');

    const hasSetCreds = await Keychain.setGenericPassword(
      ENCYPTION_KEY_ID,
      randomBytesString,
    );

    if (hasSetCreds) {
      return randomBytesString;
    }

    return null;
  }

  static async setItem(key: string, data: string) {
    const encryptionKey = await this._getEncryptionKey();

    if (encryptionKey) {
      try {
        const encryptedDataString = AESEncryption.encrypt(data, encryptionKey);

        await AsyncStorage.setItem(key, encryptedDataString);

        return true;
      } catch (e) {
        return null;
      }
    }
  }

  static async getItem(key: string) {
    const encryptionKey = await this._getEncryptionKey();

    if (encryptionKey) {
      try {
        const encryptedDataString = await AsyncStorage.getItem(key);

        if (encryptedDataString === null) {
          throw new Error();
        }

        return AESEncryption.decrypt(encryptedDataString, encryptionKey);
      } catch (e) {
        return null;
      }
    }
  }

  static async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (e) {
      return null;
    }
  }

  static async clear() {
    try {
      return await AsyncStorage.clear();
    } catch (e) {
      return null;
    }
  }

  static async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      return null;
    }
  }
}
