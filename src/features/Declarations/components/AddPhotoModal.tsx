import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {faMoneyBill, faUserNurse} from '@fortawesome/pro-regular-svg-icons';
import {Item} from 'react-native-picker-select';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';

import {
  Button,
  Loader,
  SelectInput,
  TextInput,
  Typography,
} from '@src/components';
import useTheme from '@src/hooks/useTheme';

import useFetchAllDeclarationScanTypes from '../hooks/useFetchAllDeclarationScanTypes';
import {DeclarationPhoto} from '../screens/NewDeclaration.screen';
import {Theme} from '@src/styles/styles';

interface IProps {
  declarationPhoto: DeclarationPhoto;
  acceptButton: (
    declarationPhoto: DeclarationPhoto,
    isNewDeclarationPhoto: boolean,
  ) => void;
  declineButton: (id: number, isNewDeclarationPhoto: boolean) => void;
}

const AddPhotoModal: React.FC<IProps> = ({
  declarationPhoto,
  acceptButton,
  declineButton,
}) => {
  const {
    data: fetchedScanTypes,
    isError: IsErrorLoadingScanTypes,
    isLoading: IsLoadingScanTypes,
    refetch: refetchScanTypes,
  } = useFetchAllDeclarationScanTypes();
  const [scanTypes, setScanTypes] = useState<Array<Item>>([]);
  const [selectedScanTypeId, setSelectedScanTypeId] = useState<number>(
    declarationPhoto.selectedScanTypeId,
  );

  const isNewDeclarationPhoto: boolean = declarationPhoto.id === 0;
  const id = isNewDeclarationPhoto ? new Date().valueOf() : declarationPhoto.id;
  const theme = useTheme();
  const styles = makeStyles(theme);
  const {t} = useTranslation();

  useEffect(() => {
    var sortedScanTypes = fetchedScanTypes?.scanTypes.lovs.map(scanType => {
      return {
        label: scanType.naam,
        value: scanType.id,
      } as Item;
    });
    setScanTypes(sortedScanTypes ?? []);
  }, [fetchedScanTypes]);

  var schema = Yup.object({
    amount: Yup.string()
      .required(t('newDeclaration.emptyField'))
      .transform(value => value?.replace(/,/g, '.'))
      .test(
        'is Higher than 0',
        t('newDeclaration.amountLowerThanZero'),
        value => parseFloat(value || '0') > 0,
      ),
  });

  const {handleChange, handleSubmit, values, errors} = useFormik({
    enableReinitialize: true,
    initialValues: {
      amount: declarationPhoto.amount,
    },
    validationSchema: schema,
    onSubmit: submitForm,
  });

  async function submitForm() {
    const castedAmount = parseFloat(schema.cast(values).amount!);
    var selectedScanType =
      fetchedScanTypes?.scanTypes.lovs.find(x => x.id === selectedScanTypeId)
        ?.naam || '';
    acceptButton(
      {
        ...declarationPhoto,
        amount: castedAmount,
        selectedScanType,
        selectedScanTypeId,
        id,
      },
      isNewDeclarationPhoto,
    );
  }

  const declineButtonPressed = () => {
    declineButton(id, isNewDeclarationPhoto);
  };

  if (IsLoadingScanTypes) {
    return (
      <View style={styles.content}>
        <Loader
          textColor={theme.colors.primary}
          indicatorColor={theme.colors.primary}
          text="loading..."
        />
      </View>
    );
  }

  if (IsErrorLoadingScanTypes) {
    return (
      <View style={styles.content}>
        <View>
          <Typography align="center" variant="b1" text="Something went wrong" />
          <View style={styles.errorViewButtonContainer}>
            <Button
              buttonStyle={styles.cancelButton}
              textStyle={{color: theme.colors.primary}}
              onPress={() => declineButton(id, isNewDeclarationPhoto)}
              variant="outline"
              text="cancel"
            />
            <Button
              buttonStyle={styles.tryAgainButton}
              onPress={() => refetchScanTypes}
              text="try again"
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => Keyboard.dismiss()}
        style={styles.content}>
        <>
          <View>
            <SelectInput
              label={t('newDeclaration.scanType')}
              labelStyle={styles.blackColor}
              iconStyle={styles.blackColor}
              bottomBorderStyle={styles.scanTypeInputBorderBottom}
              value={selectedScanTypeId}
              icon={faUserNurse}
              onValueChange={value => setSelectedScanTypeId(value)}
              items={scanTypes || []}
            />
            <TextInput
              icon={faMoneyBill}
              label={t('newDeclaration.amount')}
              value={values.amount.toString()}
              onChangeText={handleChange('amount')}
              labelTextStyle={styles.amountLabelStyle}
              iconStyle={styles.amountLabelStyle}
              keyboardType="numbers-and-punctuation"
              error={errors.amount}
              mainColor="black"
            />
            {declarationPhoto.image && (
              <Image
                style={styles.image}
                source={{uri: declarationPhoto.image.uri}}
              />
            )}
          </View>
          <View style={styles.footer}>
            <View style={styles.buttonsContainer}>
              <Button
                variant="outline"
                onPress={declineButtonPressed}
                text={t('newDeclaration.delete')}
                textStyle={styles.declineButtonText}
                buttonStyle={styles.declineButton}
              />
              <Button
                onPress={handleSubmit}
                text={t('newDeclaration.confirm')}
                variant="outline"
                textStyle={styles.acceptButtonText}
                buttonStyle={styles.acceptButton}
              />
            </View>
          </View>
        </>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'space-evenly',
      minHeight: 230,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    acceptButton: {
      flex: 0.45,
      borderColor: 'green',
    },
    acceptButtonText: {
      color: 'green',
    },
    declineButton: {
      flex: 0.45,
      borderColor: 'red',
    },
    declineButtonText: {
      color: 'red',
    },
    footer: {
      marginTop: 20,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    image: {
      width: 150,
      height: 150,
      resizeMode: 'cover',
      marginTop: 20,
    },
    amountLabelStyle: {
      color: 'black',
      fontWeight: 'bold',
    },
    blackColor: {
      color: 'black',
    },
    scanTypeInputBorderBottom: {
      borderBottomColor: 'black',
    },
    tryAgainButton: {
      flex: 0.45,
    },
    cancelButton: {
      flex: 0.45,
      borderColor: theme.colors.primary,
    },
    errorViewButtonContainer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
  });

export default AddPhotoModal;
