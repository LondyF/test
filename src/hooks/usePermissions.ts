import {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';

import ReactNativeBiometrics from 'react-native-biometrics';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

export enum Permissions {
  camera,
  location,
  faceId,
}

type UsePermissionsProps = Permissions;
type UsePermissionReturn = [
  boolean,
  () => Promise<void>,
  () => Promise<'unavailable' | 'blocked' | 'denied' | 'granted' | 'limited'>,
];

const permissionMap: Record<any, any> = {
  [Permissions.camera]: {
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  },
  [Permissions.location]: {
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  },
  [Permissions.faceId]: {
    ios: PERMISSIONS.IOS.FACE_ID,
    android: PERMISSIONS.ANDROID.CAMERA,
  },
};

const usePermissions = (
  permission: UsePermissionsProps,
): UsePermissionReturn => {
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

  const permToRequest = permissionMap[permission][Platform.OS];

  const requestPermissions = async () => {
    if (hasPermissions) {
      return;
    }

    const permissionResult =
      permission === Permissions.faceId
        ? await requestBiometricsPerms()
        : await request(permToRequest);

    setHasPermissions(permissionResult === RESULTS.GRANTED);
  };

  /*

    Special handling of checking Biometrics Perms
  */
  const checkBiometricsPerms = useCallback(async (): Promise<
    'unavailable' | 'blocked' | 'denied' | 'granted' | 'limited'
  > => {
    const {available, biometryType} =
      await ReactNativeBiometrics.isSensorAvailable();

    if (biometryType === ReactNativeBiometrics.FaceID) {
      const hasPerms = await check(permToRequest);

      if (hasPerms === 'denied') {
        return request(permToRequest);
      }

      return hasPerms;
    }

    return available ? 'granted' : 'blocked';
  }, [permToRequest]);

  /*
      Special handling of requesting Biometrics Perms
  */
  const requestBiometricsPerms = async () => {
    const {available, biometryType} =
      await ReactNativeBiometrics.isSensorAvailable();

    if (biometryType === ReactNativeBiometrics.FaceID) {
      return await request(permToRequest);
    }

    return available ? 'granted' : 'blocked';
  };

  const checkPermissions = useCallback(async () => {
    if (permission === Permissions.faceId) {
      return await checkBiometricsPerms();
    }

    return await check(permToRequest);
  }, [permToRequest, permission, checkBiometricsPerms]);

  useEffect(() => {
    (async function () {
      const permissionResult = await checkPermissions();

      setHasPermissions(permissionResult === RESULTS.GRANTED);
    })();
  }, [permToRequest, checkPermissions]);

  return [hasPermissions, requestPermissions, checkPermissions];
};

export default usePermissions;
