import axios from 'axios';
import moment from 'moment';

import Config from '@src/config';
import {getDeviceInfo} from '@utils/deviceInfo';

import SecureStorage from './secureStorage';

interface Creds {
  bearer: string;
  sesToken: string;
  bearerExpSec: number;
  bearerExpTime: string;
}

export default class AuthCreds {
  static async storeAuthCreds(creds: Creds) {
    const currentTime = moment();
    const tokenExpireTime = currentTime
      .add({seconds: creds.bearerExpSec})
      .toISOString();
    const tokenToStore: Creds = {
      bearer: creds.bearer,
      sesToken: creds.sesToken,
      bearerExpSec: creds.bearerExpSec,
      bearerExpTime: tokenExpireTime,
    };

    await SecureStorage.setItem(
      '@auth/authCreds',
      JSON.stringify(tokenToStore),
    );
  }

  static async getAuthCreds() {
    const rawCreds = await SecureStorage.getItem('@auth/authCreds');
    const authCreds = rawCreds ? (JSON.parse(rawCreds) as Creds) : null;

    if (!authCreds || AuthCreds.hasBearerExpired(authCreds.bearerExpTime)) {
      const user = await AuthCreds._getUser();
      const newCreds = await AuthCreds._getNewAuthCreds(authCreds!, user);

      if (newCreds) {
        await AuthCreds.storeAuthCreds(newCreds);

        return newCreds;
      }
    }
    return authCreds;
  }

  static async _getNewAuthCreds(oldCreds: Creds, user: User) {
    try {
      const deviceInfo = await getDeviceInfo();
      const res = await axios({
        url: Config.API_URL + '/auth-rn1/auth',
        method: 'post',
        data: {
          apuId: user.apuId,
          deviceId: deviceInfo.id,
        },
        headers: {
          'Api-Key': Config.CLIENT_SECRET,
          'Ses-Token': oldCreds.sesToken,
        },
      });
      const data = await res.data.refresh.auth;

      return data;
    } catch (e) {
      return null;
    }
  }

  static async _getUser() {
    const rawUser = await SecureStorage.getItem('user');
    const user = JSON.parse(rawUser!);

    return user;
  }

  static hasBearerExpired(bearerExpireTime: string) {
    const currentTime = moment();

    return currentTime.add({minute: 2}).isAfter(bearerExpireTime);
  }
}
