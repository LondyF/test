import React from 'react';

import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import {TransactionTypes} from '@src/constants';
import DigitalSignatureScreen from '@src/features/Identify/screens/digitalSignature.screen';
import IdentifyScreen from '@src/features/Identify/screens/identify.screen';
import {LabRequest} from '@src/features/Laboratory/types/laboratory';
import AllPrescriptionsScreen from '@src/features/Prescription/screens/allPrescriptions.screen';
import {Prescription} from '@src/features/Prescription/prescription';

export type PrescriptionStackParamList = {
  AllPrescriptions: {user?: User; mdsId?: number} | undefined;
  Identify: {
    data: Prescription | LabRequest;
    id: number;
    transactionType: TransactionTypes;
    mdsId?: number;
    mdsUser?: User;
  };
  DigitalSignature: undefined;
};

const PrescriptionNavigator =
  createStackNavigator<PrescriptionStackParamList>();

const PrescriptionIdentifyScreen: React.FC<
  StackScreenProps<PrescriptionStackParamList, 'Identify'>
> = ({route}) => <IdentifyScreen route={route} />;

const PrescriptionStack: React.FC = () => {
  const {t} = useTranslation();

  return (
    <PrescriptionNavigator.Navigator>
      <PrescriptionNavigator.Screen
        name="AllPrescriptions"
        component={AllPrescriptionsScreen}
      />
      <PrescriptionNavigator.Screen
        name="Identify"
        options={{title: t('dashboard.identify')}}
        component={PrescriptionIdentifyScreen}
      />
      <PrescriptionNavigator.Screen
        name="DigitalSignature"
        options={{title: t('digitalSignature.title')}}
        component={DigitalSignatureScreen}
      />
    </PrescriptionNavigator.Navigator>
  );
};

export default PrescriptionStack;
