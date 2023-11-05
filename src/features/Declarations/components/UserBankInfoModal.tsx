import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Item} from 'react-native-picker-select';
import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';

import useFetchUserBankInfo from '../hooks/useFetchUserBankInfo';

import useFetchAllBanks from '@src/hooks/useFetchAllBanks';
import {
  Button,
  Loader,
  SelectInput,
  TextInput,
  Typography,
} from '@src/components';
import useTheme from '@src/hooks/useTheme';
import {
  faUser,
  faPiggyBank,
  faCreditCard,
} from '@fortawesome/pro-regular-svg-icons';
import useSaveUserBankInfo from '../hooks/useSaveUserBankInfo';
import useAuthStore from '@src/stores/useAuthStore';
import useToast from '@src/components/Toast/useToast';
import {ToastTypes} from '@src/components/Toast/toastTypes';

interface IProps {
  closeModal: () => void;
}

const UserBankInfoModal: React.FC<IProps> = ({closeModal}) => {
  const user = useAuthStore(state => state.user);

  const {t} = useTranslation();
  const {
    data,
    isLoading: isLoadingUserBankInfo,
    isFetching,
  } = useFetchUserBankInfo(user?.apuId || -1);
  const {data: FetchedBanks, isLoading: isLoadingBanks} = useFetchAllBanks();
  const {mutateAsync, isLoading: IsSavingBankInfo} = useSaveUserBankInfo();

  const [banks, setBanks] = useState<Item[]>([]);
  const [selectedBank, setSelectedBank] = useState<number>(0);

  const Theme = useTheme();
  const Toast = useToast();

  const {
    colors: {primary},
  } = Theme;

  useEffect(() => {
    const banksItems =
      FetchedBanks &&
      FetchedBanks.banken.lovs.map(bank => {
        return {
          label: bank.naam,
          value: bank.id,
        } as Item;
      });

    setBanks(banksItems ?? []);
    if (data) {
      setSelectedBank(data!.bankinfo.bank.id);
    }
  }, [FetchedBanks, data]);

  const {handleChange, handleSubmit, values, errors} = useFormik({
    enableReinitialize: true,
    initialValues: {
      accountNumber: (data && data?.bankinfo.rekeningNummer) || '',
      inNameOf: (data && data.bankinfo.tnv) || '',
    },
    validationSchema: Yup.object({
      accountNumber: Yup.string()
        .required(t('validators.requiredField'))
        .max(23, t('validators.maxAmountCharacters', {amount: 25}))
        .matches(/^\d+$/, t('validators.onlyNumbers')),
      inNameOf: Yup.string()
        .required(t('validators.requiredField'))
        .min(
          2,
          t('validators.minimumAmountCharacters', {
            amount: 2,
          }),
        )
        .max(255),
    }),
    onSubmit: submitForm,
  });

  async function submitForm({
    accountNumber,
    inNameOf,
  }: {
    accountNumber: string;
    inNameOf: string;
  }) {
    let {
      bankinfo: {status},
    } = await mutateAsync({
      apuId: user?.apuId || -1,
      inNameOf,
      accountNumber,
      bankId: selectedBank,
    });

    if (status.status === 0) {
      closeModal();
      Toast('Successfully saved', ToastTypes.SUCCESS);
    } else {
      Toast(status.msg, ToastTypes.SUCCESS);
    }
  }

  var isLoading =
    IsSavingBankInfo ||
    isLoadingBanks ||
    isFetching ||
    isLoadingUserBankInfo ||
    banks.length === 0;

  return (
    <View style={styles.content}>
      {!isLoading ? (
        <View>
          <Typography
            text="Bank Info"
            variant="h1"
            fontWeight="bold"
            textStyle={styles.contentTitle}
          />
          <SelectInput
            label="bank"
            labelStyle={styles.blackColor}
            bottomBorderStyle={styles.selectInputBorder}
            onValueChange={value => setSelectedBank(value)}
            value={selectedBank}
            items={banks}
            icon={faPiggyBank}
            iconStyle={styles.blackColor}
          />
          <TextInput
            labelTextStyle={styles.textInputLabelStyle}
            value={values.accountNumber}
            label="rekenining nummer"
            onChangeText={handleChange('accountNumber')}
            icon={faCreditCard}
            errorColor="red"
            error={errors.accountNumber}
            iconStyle={styles.blackColor}
            maxLength={23}
            mainColor="black"
          />
          <TextInput
            labelTextStyle={styles.textInputLabelStyle}
            icon={faUser}
            onChangeText={handleChange('inNameOf')}
            value={values.inNameOf}
            errorColor="red"
            error={errors.inNameOf}
            label="ten name van:"
            mainColor="black"
          />
          <Button
            buttonStyle={styles.buttonStyle}
            text="save"
            onPress={handleSubmit}
          />
        </View>
      ) : (
        <Loader
          textColor={primary}
          indicatorColor={primary}
          text="Loading data....."
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 22,
    minHeight: 250,
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  buttonStyle: {
    marginTop: 20,
  },
  blackColor: {
    color: 'black',
  },
  selectInputBorder: {
    borderBottomColor: 'black',
  },
  textInputLabelStyle: {
    fontWeight: 'bold',
  },
});

export default UserBankInfoModal;
