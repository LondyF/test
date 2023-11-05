import React from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';

import {faFilesMedical} from '@fortawesome/pro-regular-svg-icons';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';

import {Typography, TextInput, Button} from '@src/components';
import {useNavigation} from '@react-navigation/core';
import {Theme as ThemeTypes} from '@src/styles/styles';
import useTheme from '@src/hooks/useTheme';

interface IProps {
  setShowModal: (_: boolean) => void;
  createNewCatalog: (catalogName: string) => void;
}

const NewDeclarationModal: React.FC<IProps> = ({
  setShowModal,
  createNewCatalog,
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const appTheme = useTheme();
  const styles = makeStyles(appTheme);

  const {handleChange, handleSubmit, values, errors} = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      catalogName: '',
    },
    validationSchema: Yup.object({
      catalogName: Yup.string()
        .required('This field cant be empty')
        .min(2, 'The field should have 2 letters or more'),
    }),
    onSubmit: createNewDeclarationSubmit,
  });

  function createNewDeclarationSubmit({catalogName}: {catalogName: string}) {
    Keyboard.dismiss();
    createNewCatalog(catalogName);
  }

  const cancelButtonPressed = () => {
    setShowModal(false);
    navigation.goBack();
  };
  return (
    <View style={styles.content}>
      <Typography
        variant="h1"
        fontSize={20}
        fontWeight="bold"
        text={t('declarations.newDeclaration')}
      />
      <TextInput
        labelTextStyle={styles.inputLabelText}
        icon={faFilesMedical}
        label={t('newDeclaration.catalogName')}
        placeholder={t('newDeclaration.catalogInputPlaceholder')}
        value={values.catalogName}
        error={errors.catalogName}
        onChangeText={handleChange('catalogName')}
        placeholderTextColor="gray"
        errorColor="red"
        mainColor="black"
      />
      <View style={styles.buttonContainer}>
        <Button
          variant="outline"
          buttonStyle={styles.cancelButtonStyle}
          textStyle={styles.cancelButtonTextStyle}
          text={t('common.cancel')}
          onPress={cancelButtonPressed}
        />
        <Button
          buttonStyle={styles.buttonStyle}
          text={t('common.save')}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

const makeStyles = (theme: ThemeTypes) =>
  StyleSheet.create({
    content: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'space-evenly',
      minHeight: 230,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    buttonStyle: {
      marginTop: 20,
      flex: 0.48,
    },
    cancelButtonStyle: {
      marginTop: 20,
      flex: 0.48,
      borderColor: theme.colors.primary,
    },
    cancelButtonTextStyle: {
      color: theme.colors.primary,
    },
    modalTitle: {
      fontSize: 20,
    },
    inputLabelText: {
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });

export default NewDeclarationModal;
