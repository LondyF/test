import { Platform, NativeModules } from 'react-native';

import request from '@utils/request';

export const getSignature = async (): Promise<string | null> => {
  try {
    const { SignatureModule } = NativeModules;

    return (await SignatureModule.getSignature()) as string;
  } catch (e) {
    return e?.message ?? 'Failed Obtaining Signature';
  }
};

export const hasValidSignature = async (
  user: User | null | undefined | false,
): Promise<boolean> => {
  try {
    const shouldCheckSignature = Platform.OS === 'android' && !user && !__DEV__;

    if (!shouldCheckSignature) {
      return true;
    }

    const signature = await getSignature();
    await request({
      url: '/auth-rn1/signature',
      method: 'POST',
      storeInCache: false,
      requiresAuth: false,
      data: {
        signature,
      },
    });

    return true;
  } catch (e) {
    return false;
  }
};

export const killApp = () => {
  const { SignatureModule } = NativeModules;

  SignatureModule.killApp();
};
