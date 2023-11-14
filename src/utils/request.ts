import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import NetInfo from '@react-native-community/netinfo';

import Config from '@src/config';
import Cache, { CachedItem } from '@helpers/cache';
import AuthToken from '@helpers/authCreds';
import SecureStorage from '@helpers/secureStorage';
import { getDeviceInfo } from './deviceInfo';

interface RequestArgs extends AxiosRequestConfig {
  storeInCache?: boolean;
  requiresAuth?: boolean;
}

const client = axios.create({
  baseURL: Config.API_URL,
  headers: {
    'Api-Key': Config.CLIENT_SECRET,
    'Cache-Control': 'no-cache, no-store',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

const hasConnectionAndHasInternet = async () => {
  const networkState = await NetInfo.fetch();

  return networkState.isConnected && networkState.isInternetReachable !== false;
};

const onRequestSuccess = (response: AxiosResponse | CachedItem) =>
  response.data;

const onRequestError = (error: any) => {
  throw error;
};

const request = async ({
  data,
  requiresAuth = true,
  storeInCache = true,
  ...options
}: RequestArgs) => {
  try {
    let defaultOptions = {};

    if (requiresAuth) {
      const authCreds = await AuthToken.getAuthCreds();

      defaultOptions = {
        headers: {
          Authorization: `Bearer ${authCreds.bearer}`,
          'Ses-Token': authCreds.sesToken,
        },
      };
    }

    const deviceInfo = await getDeviceInfo();
    const testURL = await SecureStorage.getItem(Config.TEST_MODE_STORAGE_KEY);
    const loadFromCache = !(await hasConnectionAndHasInternet());
    const cacheKey = data?.apuId + (data?.mdsId ?? 0);

    console.log(Config);

    const response = !loadFromCache
      ? await client({
        ...options,
        ...defaultOptions,
        baseURL: testURL ? testURL : client.defaults.baseURL,
        data:
          options.method === 'GET'
            ? undefined
            : {
              ...data,
              deviceId: deviceInfo.id,
            },
      })
      : await Cache.getStoredCacheItem(options.url!, cacheKey);

    console.log(response);

    if (!loadFromCache && storeInCache) {
      await Cache.storeCacheItem(options.url!, response.data, cacheKey);
    }

    if (__DEV__) {
      console.log('response:', response, 'data:', data);
    }

    return onRequestSuccess(response);
  } catch (error) {
    throw onRequestError(error);
  }
};

export default request;
