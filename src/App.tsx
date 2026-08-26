import React, {useCallback, useEffect} from 'react';

import * as SplashScreen from 'expo-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {useTranslation} from 'react-i18next';
import {NotificationClickEvent, OneSignal} from 'react-native-onesignal';
import {SafeAreaProvider} from 'react-native-safe-area-context';

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

SplashScreen.preventAutoHideAsync().catch(() => {});

OneSignal.Debug.setLogLevel(6);
OneSignal.initialize('44ce5487-cba3-4080-92cc-887eee282fb0');
Promise.resolve(OneSignal.Notifications.requestPermission(true)).catch(error => {
  if (__DEV__) {
    console.log('OneSignal permission request failed', error);
  }
});

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

  const handleNotificationOpened = useCallback(
    (openedEvent: NotificationClickEvent) => {
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
    },
    [setRedirectSettings],
  );

  useEffect(() => {
    OneSignal.Notifications.addEventListener('click', handleNotificationOpened);

    return () => {
      OneSignal.Notifications.removeEventListener(
        'click',
        handleNotificationOpened,
      );
    };
  }, [handleNotificationOpened]);

  useEffect(() => {
    const hideSplashScreen = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        if (__DEV__) {
          console.log('Failed hiding splash screen', error);
        }
      }
    };

    (async () => {
      if (!ready) {
        return;
      }

      try {
        if (__DEV__) {
          await SecureStorage.debugSnapshot('bootstrap:before-read-user');
        }

        const storedUser = await getStoredUser();
        const hasStoredUser = !!storedUser;

        if (__DEV__) {
          console.log('[App] bootstrap stored user', {
            hasStoredUser,
            apuId: storedUser?.apuId ?? null,
          });
        }

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
      } catch (error) {
        if (__DEV__) {
          console.log('App bootstrap failed', error);
        }
      } finally {
        await hideSplashScreen();
      }
    })();
  }, [ready, setUser, i18n]);

  useEffect(() => {
    const splashFallback = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 5000);

    return () => clearTimeout(splashFallback);
  }, []);

  const getStoredUser = async (): Promise<User | null> => {
    const user = await SecureStorage.getItem('user');

    if (user === undefined || user === null) {
      if (__DEV__) {
        console.log('[App] getStoredUser: no decrypted user value');
      }

      return null;
    }

    try {
      const parsedUser = JSON.parse(user) as User;

      if (__DEV__) {
        console.log('[App] getStoredUser: parsed user', {
          apuId: parsedUser.apuId ?? null,
          lang: parsedUser.lang ?? null,
        });
      }

      return parsedUser;
    } catch (error) {
      if (__DEV__) {
        console.log('[App] getStoredUser: invalid JSON, removing stored user', {
          preview: user.slice(0, 80),
          error: String(error),
        });
      }

      await SecureStorage.removeItem('user');

      return null;
    }
  };

  if (!ready) {
    return (
      <Loader text="" textColor={primaryBlue} indicatorColor={primaryBlue} />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <ActionSheetProvider>
            <ToastContainer>
              <RootStack />
            </ToastContainer>
          </ActionSheetProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default gestureHandlerRootHOC(App);
