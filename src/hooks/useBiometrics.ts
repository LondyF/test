import {useCallback} from 'react';

import ReactNativeBiometrics from 'react-native-biometrics';
import {RESULTS} from 'react-native-permissions';

import useAuthStore from '@stores/useAuthStore';

import usePermissions, {Permissions} from './usePermissions';
import usePin from './usePin';

const biometrics = new ReactNativeBiometrics();

const useBiometrics = () => {
  const [_, __, checkBiometricsPermissions] = usePermissions(
    Permissions.faceId,
  );
  const user = useAuthStore(state => state.user);

  const {authenticateUser} = usePin(user?.pin ?? '');

  const getAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const hasFaceIdPermissions =
        (await checkBiometricsPermissions()) === RESULTS.GRANTED;
      const available =
        hasFaceIdPermissions &&
        user?.biometricEnabled &&
        (await biometrics.isSensorAvailable()).available;

      return !!available && hasFaceIdPermissions;
    } catch (e) {
      return false;
    }
  }, [checkBiometricsPermissions, user?.biometricEnabled]);

  const promptBiometrics = useCallback(
    async (
      fallbackToPin = false,
      navigateBackScreen = '',
      title = 'use biometrics to authenticate',
    ) => {
      try {
        const isBiometricAvailable = await getAvailability();

        if (!isBiometricAvailable && !fallbackToPin) {
          return false;
        }

        if (!isBiometricAvailable && fallbackToPin) {
          return await authenticateUser(navigateBackScreen);
        }

        var {success} = await biometrics.simplePrompt({
          promptMessage: title,
          cancelButtonText: 'cancel',
        });

        if (!success && fallbackToPin) {
          return await authenticateUser(navigateBackScreen);
        }

        return success;
      } catch {
        return false;
      }
    },
    [getAvailability, authenticateUser],
  );

  return {getAvailability, promptBiometrics};
};
export default useBiometrics;
