import {useCallback} from 'react';
import {LogBox} from 'react-native';

import {arrayEquals} from '@src/utils';
import usePinStore from '@src/stores/usePinStore';

import {useNavigation} from '@react-navigation/core';
import useAuthStore from '@src/stores/useAuthStore';
import SecureStorage from '@src/helpers/secureStorage';
import useToast from '@src/components/Toast/useToast';
import {ToastTypes} from '@src/components/Toast/toastTypes';
import {useTranslation} from 'react-i18next';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const usePin = (userPin: number | string, maxAttempts = 3) => {
  const {navigate, goBack} = useNavigation();
  const Toast = useToast();
  const {t} = useTranslation();

  enum State {
    EnterOldPin,
    EnterNewPin,
  }

  const [resetPinTitle, setPinTitle] = usePinStore(state => [
    state.resetPinTitle,
    state.setPinTitle,
  ]);

  const [user, setUser] = useAuthStore(state => [state.user, state.setUser]);

  const pinValidator = useCallback(
    (rawEnteredPin: Array<string>) => {
      const enteredPin = rawEnteredPin.join('');
      const userPinString = userPin.toString();

      return enteredPin === userPinString;
    },
    [userPin],
  );

  const navigateBack = useCallback(
    (navigateBackScreen: string) => {
      if (navigateBackScreen !== '') {
        navigate(navigateBackScreen);
      } else {
        goBack();
      }
    },
    [goBack, navigate],
  );

  const authenticateUser = useCallback(
    (navigateBackScreen: string = '') => {
      let attempts = 0;

      return new Promise((resolve, reject) => {
        const onCancel = () => {
          reject(false);
          navigateBack(navigateBackScreen);
        };

        const onPinError = () => {
          attempts++;

          if (attempts >= maxAttempts) {
            navigateBack(navigateBackScreen);
            reject(false);
          }
        };

        const onPinSuccess = () => {
          resolve(true);
          navigateBack(navigateBackScreen);
        };

        navigate('Pin', {
          pinValidator,
          onPinError,
          onPinSuccess,
          onCancel,
        });
      });
    },
    [maxAttempts, navigate, navigateBack, pinValidator],
  );

  const changeUserPin = useCallback(
    (navigateBackScreen: string = '') => {
      let newPin: string[] | null = null;
      let state: State = State.EnterOldPin;

      return new Promise((resolve, reject) => {
        setPinTitle(t('changePin.enterCurrentPin'));

        const cancelUpdatePin = () => {
          navigateBack(navigateBackScreen);
          reject(false);
        };

        const updatePinInStore = async (pin: string[]) => {
          let updatedUser = {...user, pin: pin.join('')};

          setUser(updatedUser);
          await SecureStorage.setItem('user', JSON.stringify(updatedUser));
        };

        const onPinSuccess = () => {};

        const validatePin = (pin: string[]) => {
          if (state === State.EnterOldPin) {
            let isPinValid: boolean = pinValidator(pin);
            if (isPinValid) {
              setPinTitle(t('changePin.enterNewPin'));
              state = State.EnterNewPin;
            } else {
              Toast(t('changePin.pinNotCorrect'), ToastTypes.ERROR);
              state = State.EnterOldPin;
            }
            return isPinValid;
          }

          if (state === State.EnterNewPin) {
            if (newPin === null) {
              newPin = pin;
              setPinTitle(t('changePin.confirmPin'));
              return true;
            }

            if (!arrayEquals(newPin, pin)) {
              Toast(t('changePin.pinsAreNotEqual'), ToastTypes.ERROR);
              return false;
            }

            updatePinInStore(pin);
            resetPinTitle();
            Toast(t('changePin.pinSuccessfullyChanged'), ToastTypes.SUCCESS);
            resolve(true);
            navigateBack(navigateBackScreen);

            return true;
          }
        };

        navigate('Pin', {
          pinValidator: validatePin,
          onPinError: cancelUpdatePin,
          onCancel: cancelUpdatePin,
          onPinSuccess,
        });
      });
    },
    [
      State.EnterNewPin,
      State.EnterOldPin,
      Toast,
      navigate,
      navigateBack,
      pinValidator,
      resetPinTitle,
      setPinTitle,
      setUser,
      t,
      user,
    ],
  );

  return {
    authenticateUser,
    changeUserPin,
  };
};

export default usePin;
