import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import backend, {BackendOptions, RequestCallback} from 'i18next-http-backend';

import request from '@utils/request';
import Config from '@src/config';

const backendOptions: BackendOptions = {
  loadPath: `${Config.API_URL}/lang-rn1/talen/{{lng}}`,
  request: async (_: any, url: string, __: any, callback: RequestCallback) => {
    try {
      const req = await request({
        url,
        method: 'GET',
        storeInCache: true,
        requiresAuth: false,
      });

      callback(null, {
        status: 200,
        data: req,
      });
    } catch (e) {
      callback(null, {
        status: 500,
        data: '',
      });
    }
  },
};

i18n
  .use(initReactI18next)
  .use(backend)
  .init({
    lng: 'en',
    backend: backendOptions,
    fallbackLng: 'en',
    debug: true,
    react: {
      useSuspense: false,
    },
  });

export default i18n;
