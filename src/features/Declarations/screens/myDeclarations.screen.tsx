import React, {useState} from 'react';

import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';

import {faPlus} from '@fortawesome/pro-solid-svg-icons';
import Modal from 'react-native-modal';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {FloatingActionButton, Loader} from '@src/components';
import useAuthStore from '@stores/useAuthStore';
import useTheme from '@hooks/useTheme';
import useInternetConnection from '@hooks/useInternetConnection';

import UserBankInfoModal from '../components/UserBankInfoModal';
import useFetchDeclarations from '../hooks/useFetchDeclarations';
import DeclarationsList from '../components/DeclarationsList';

const Tab = createMaterialTopTabNavigator();

const MyDeclarations = () => {
  const {checkIfConnected} = useInternetConnection();
  const {showActionSheetWithOptions} = useActionSheet();
  const {t} = useTranslation();
  const user = useAuthStore(state => state.user);
  const {isPending} = useFetchDeclarations(user?.apuId || -1);
  const {navigate} = useNavigation();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const theme = useTheme();

  const showOptions = () => {
    checkIfConnected(() => {
      const options = [
        t('declarations.newDeclaration'),
        t('declarations.accountInformation'),
        t('common.cancel'),
      ];
      const cancelButtonIndex = options.length - 1;
      showActionSheetWithOptions(
        {options: options, cancelButtonIndex},
        buttonIndex => {
          let chosenOption = options[buttonIndex];
          if (chosenOption === options[1]) {
            setModalVisible(true);
          }
          if (chosenOption === options[0]) {
            navigate('NewDeclaration');
          }
        },
      );
    });
  };

  if (isPending) {
    return (
      <Loader
        textColor={theme.colors.primary}
        indicatorColor={theme.colors.primary}
        text={'loading declarations'}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        onBackdropPress={() => setModalVisible(false)}
        isVisible={isModalVisible}>
        <KeyboardAvoidingView behavior="position">
          <UserBankInfoModal closeModal={() => setModalVisible(false)} />
        </KeyboardAvoidingView>
      </Modal>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {
            textTransform: 'capitalize',
            fontWeight: 'bold',
          },
          indicatorStyle: {
            backgroundColor: theme.colors.primary,
          },
          activeTintColor: theme.colors.primary,
          inactiveTintColor: theme.colors.lightGray,
        }}>
        <Tab.Screen
          options={{
            title: 'Pending',
          }}
          name="PendingDeclarations"
          children={() => (
            <DeclarationsList status={[1, 2, 3, 4]} apuId={user?.apuId || -1} />
          )}
        />
        <Tab.Screen
          options={{
            title: 'Approved',
          }}
          name="ApprovedDeclarations"
          children={() => (
            <DeclarationsList status={[5]} apuId={user?.apuId || -1} />
          )}
        />
        <Tab.Screen
          options={{
            title: 'Rejected',
          }}
          name="RejectedDeclarations"
          children={() => (
            <DeclarationsList status={[6]} apuId={user?.apuId || -1} />
          )}
        />
      </Tab.Navigator>
      <FloatingActionButton
        buttonColor={theme.colors.primary}
        icon={faPlus}
        onPress={showOptions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default MyDeclarations;
