import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, Image} from 'react-native';

import {useFormik} from 'formik';
import {faLock} from '@fortawesome/pro-solid-svg-icons';
import {useNavigation} from '@react-navigation/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';

import useAuthStore from '@stores/useAuthStore';
import {
  PageContainer,
  Typography,
  TextInput,
  Button,
  Loader,
} from '@src/components';

import useChangePassword from '../hooks/useChangePassword';

const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const apuId = useAuthStore(state => state.user?.apuId);

  const {
    mutate,
    isError: isChangePasswordError,
    error: changePasswordError,
    isLoading,
    isSuccess,
  } = useChangePassword();

  useEffect(() => {
    if (isChangePasswordError) {
      const message = changePasswordError?.response?.data.access.status.msg;

      Alert.alert('Something Went Wrong', message);
    }
  }, [changePasswordError, isChangePasswordError]);

  const {handleChange, handleSubmit, errors} = useFormik({
    initialValues: {
      oldPassword: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required(t('changePassword.requiredField')),
      password: Yup.string()
        .required(t('changePassword.requiredField'))
        .notOneOf(
          [Yup.ref('oldPassword')],
          t('changePassword.newAndOldCantMatch'),
        )
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!,.%*\-#?&])[A-Za-z\d@$!,.%*\-#?&]{8,}$/,
          t('changePassword.doesntMatchCriteria'),
        ),
      passwordConfirm: Yup.string()
        .required(t('changePassword.requiredField'))
        .oneOf(
          [Yup.ref('password')],
          t('changePassword.newAndConfirmShouldMatch'),
        ),
    }),
    onSubmit: ({password, passwordConfirm, oldPassword}) => {
      mutate({
        apuId,
        newPassword: password,
        newPasswordConfirm: passwordConfirm,
        oldPassword,
      });
    },
  });

  const PASSWORD_CRITERIA = [
    t('changePassword.hasToBe8Length'),
    t('changePassword.cantBeOldPassword'),
    t('changePassword.includeUppercase'),
    t('changePassword.includeLowerCase'),
    t('changePassword.includeSpecial'),
  ];

  return (
    <PageContainer variant="blue">
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        {!isLoading ? (
          <>
            <View style={styles.flex}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <Typography
                  color="black"
                  fontWeight="bold"
                  variant="b1"
                  text={t('common.back')}
                />
              </TouchableOpacity>
              {!isSuccess ? (
                <>
                  <Typography
                    variant="h1"
                    text={t('changePassword.changePassword')}
                    fontWeight="bold"
                    color="white"
                  />
                  <Typography
                    variant="b1"
                    textStyle={styles.subText}
                    fontWeight="bold"
                    color="white"
                    text={t('changePassword.passwordHasToMatchCriteria')}
                  />
                  {PASSWORD_CRITERIA.map((criteria, index) => (
                    <Typography
                      key={index}
                      variant="b1"
                      fontWeight="bold"
                      color="white"
                      text={`- ${criteria}`}
                    />
                  ))}

                  <View style={styles.flex}>
                    <Typography
                      variant="b1"
                      textStyle={styles.explanation}
                      fontWeight="bold"
                      color="white"
                      text={t('changePassword.enterOldAndNewPassword')}
                    />
                    <View>
                      <TextInput
                        icon={faLock}
                        label={t('changePassword.oldPassword')}
                        mainColor="white"
                        secureTextEntry={true}
                        onChangeText={handleChange('oldPassword')}
                        error={errors.oldPassword}
                        errorColor="black"
                        containerStyle={styles.inputContainer}
                      />
                      <TextInput
                        icon={faLock}
                        label={t('changePassword.newPassword')}
                        mainColor="white"
                        secureTextEntry={true}
                        onChangeText={handleChange('password')}
                        error={errors.password}
                        errorColor="black"
                        containerStyle={styles.inputContainer}
                        maxLength={50}
                      />
                      <TextInput
                        icon={faLock}
                        label={t('changePassword.repeatNewPassword')}
                        mainColor="white"
                        secureTextEntry={true}
                        error={errors.passwordConfirm}
                        onChangeText={handleChange('passwordConfirm')}
                        errorColor="black"
                        maxLength={50}
                      />
                    </View>
                    <View style={styles.buttonContainer}>
                      <Button
                        onPress={handleSubmit}
                        variant="secondary"
                        text={t('changePassword.submitNewPassword')}
                      />
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <Image
                    style={styles.successIcon}
                    source={require('@assets/success_white.png')}
                  />
                  <Typography
                    textStyle={styles.photoUploadedText}
                    variant="h3"
                    fontWeight="bold"
                    align="center"
                    color="white"
                    text={t('changePassword.passwordSuccesfullyChanged')}
                  />
                  <Button
                    buttonStyle={styles.continueButton}
                    onPress={() => navigation.goBack()}
                    variant="secondary"
                    text={t('reuploadValidation.continueToApp')}
                  />
                </View>
              )}
            </View>
          </>
        ) : (
          <Loader text="Changing Password" />
        )}
      </KeyboardAwareScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingVertical: 30,
    flexGrow: 1,
  },
  subText: {
    marginVertical: 20,
  },
  explanation: {
    marginTop: 40,
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  backButton: {
    marginBottom: 30,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  successIcon: {
    width: 200,
    height: 200,
  },
  photoUploadedText: {
    marginVertical: 30,
  },
  continueButton: {
    marginBottom: 10,
  },
});

export default ChangePasswordScreen;
