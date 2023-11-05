import {Alert} from 'react-native';

import {useNetInfo} from '@react-native-community/netinfo';
import {useTranslation} from 'react-i18next';

const useInternetConnection = () => {
  const {t} = useTranslation();
  const netInfo = useNetInfo();

  const checkIfConnected = (callback: Function) => {
    if (netInfo.isConnected) {
      callback();
    } else {
      Alert.alert(t('common.noConnectionTitle'), t('common.noConnection'));
    }
  };
  return {...netInfo, checkIfConnected};
};

export default useInternetConnection;
