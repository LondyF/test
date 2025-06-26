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
import {DeclarationStatus} from '../types/declarations';

const ActionRequiredBadge = ({apuId}: {apuId: number}) => {
  const {data} = useFetchDeclarations(apuId);

  const hasActionRequired = data?.some(
    declaration => declaration.progressId === DeclarationStatus.ACTION_REQUIRED,
  );

  if (!hasActionRequired) {
    return null;
  }

  return <View style={styles.awaitingActionBadge} />;
};

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
          if (buttonIndex === undefined) {
            return;
          }

          let chosenOption = options[buttonIndex];
          if (chosenOption === options[1]) {
            setModalVisible(true);
          }
          if (chosenOption === options[0]) {
            //@ts-ignore
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
        screenOptions={{
          tabBarLabelStyle: {
            textTransform: 'capitalize',
            fontWeight: 'bold',
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.lightGray,
        }}>
        <Tab.Screen
          options={{
            title: 'Pending',
          }}
          name="PendingDeclarations"
          children={() => (
            <DeclarationsList
              status={[
                DeclarationStatus.DRAFT,
                DeclarationStatus.IN_PROGRESS,
                DeclarationStatus.SUBMITTED,
              ]}
              apuId={user?.apuId || -1}
            />
          )}
        />
        <Tab.Screen
          options={{
            title: 'Awaiting Action',
            tabBarBadge: () => (
              <ActionRequiredBadge apuId={user?.apuId || -1} />
            ),
          }}
          name="ActionRequiredDeclarations"
          children={() => (
            <DeclarationsList
              status={[DeclarationStatus.ACTION_REQUIRED]}
              apuId={user?.apuId || -1}
            />
          )}
        />
        <Tab.Screen
          options={{
            title: 'Completed',
          }}
          name="CompletedDeclarations"
          children={() => (
            <DeclarationsList
              status={[DeclarationStatus.COMPLETED]}
              apuId={user?.apuId || -1}
            />
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
  awaitingActionBadge: {
    width: 8,
    height: 8,
    backgroundColor: 'orange',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    top: 12,
    right: 6,
  },
});

export default MyDeclarations;
