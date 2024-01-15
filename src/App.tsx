import React, {useEffect} from 'react';

import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {useTranslation} from 'react-i18next';
import {NotificationClickEvent, OneSignal} from 'react-native-onesignal';

import {Loader} from '@components/index';
import {primaryBlue} from '@styles/colors';
import {hasValidSignature, killApp} from '@utils/signature_check';

import {RootStack} from './navigations';
import SecureStorage from './helpers/secureStorage';
import ToastContainer from './components/Toast/ToastContainer';
import useAuthStore from './stores/useAuthStore';

import '@services/i18n';
import {
  doConversion,
  doesSQLiteDatabaseExist,
} from '@services/conversion-service';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import config from './config';

OneSignal.Debug.setLogLevel(6);
OneSignal.initialize('44ce5487-cba3-4080-92cc-887eee282fb0');
OneSignal.Notifications.requestPermission(true);

const queryClient = new QueryClient();

interface AdditionalData {
  action?: string;
  pageKey?: string;
  additionalData?: string;
}

const App = () => {
  const {ready, i18n} = useTranslation();
  const [setUser, setRedirectSettings] = useAuthStore(state => [
    state.setUser,
    state.setRedirectSettings,
  ]);

  OneSignal.Notifications.addEventListener('click', handleNotficationOpened);

  function handleNotficationOpened(openedEvent: NotificationClickEvent) {
    const data = openedEvent.notification.additionalData as AdditionalData;
    const action = data?.action ?? '';
    const pageKey = data?.pageKey ?? '';
    const additionalData = data?.additionalData ?? '';

    if (action === 'navigate') {
      setRedirectSettings({
        pageKey,
        additionalData,
      });
    }
  }

  useEffect(() => {
    (async () => {
      if (ready) {
        const storedUser = await getStoredUser();
        const hasStoredUser = !!storedUser;

        await SecureStorage.removeItem(config.TEST_MODE_STORAGE_KEY);

        const user = hasStoredUser
          ? storedUser
          : (await doesSQLiteDatabaseExist()) && (await doConversion());

        if (!(await hasValidSignature(user))) {
          return killApp();
        }

        if (user) {
          setUser(user);
        }

        i18n.changeLanguage((user as User)?.lang ?? 'en');
        SplashScreen.hide();
      }
    })();
  }, [ready, setUser, i18n]);

  const getStoredUser = async (): Promise<User | null> => {
    const user = await SecureStorage.getItem('user');

    if (user === undefined || user === null) {
      return null;
    }

    return JSON.parse(user);
  };

  if (!ready) {
    return (
      <Loader text="" textColor={primaryBlue} indicatorColor={primaryBlue} />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <ActionSheetProvider>
          <ToastContainer>
            <RootStack />
          </ToastContainer>
        </ActionSheetProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default gestureHandlerRootHOC(App);
