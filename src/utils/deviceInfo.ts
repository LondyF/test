import {
  getBuildNumber,
  getDeviceName,
  getSystemVersion,
  getUniqueId,
  getDeviceId,
  getSystemName,
} from 'react-native-device-info';

export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  const [id, os, name, osVersion, appVersion, model] = await Promise.all([
    getUniqueId(),
    getSystemName(),
    getDeviceName(),
    getSystemVersion(),
    getBuildNumber(),
    getDeviceId(),
  ]);

  return {
    id,
    os,
    model,
    name,
    osVersion,
    appVersion,
  };
};
