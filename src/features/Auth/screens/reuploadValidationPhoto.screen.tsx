import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Alert} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlusCircle} from '@fortawesome/pro-light-svg-icons';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {ValidationStatus} from '@src/types/validationStatus';
import {Button, PageContainer, Typography, Loader} from '@src/components';
import useUploadPhotoOfId from '@hooks/useUploadPhotoOfId';
import useAuthStore from '@stores/useAuthStore';
import {ScrollView} from 'react-native-gesture-handler';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';

interface Props {
  route: RouteProp<
    {
      params: {
        mandansaUser?: User;
      };
    },
    'params'
  >;
}

const ReuploadValidationPhoto: React.FC<Props> = ({route}) => {
  const [storedUser, setAuthenticatedUser, logoutUser] = useAuthStore(state => [
    state.user,
    state.storeAuthenticatedUser,
    state.resetAuthentication,
  ]);

  const apuId = useAuthStore(state => state.user?.apuId);
  const isMandansa = route.params?.mandansaUser !== undefined;
  const [user, _] = useState(route.params?.mandansaUser ?? storedUser);

  const {goBack} = useNavigation();
  const queryClient = useQueryClient();
  const {t} = useTranslation();
  const {showActionSheetWithOptions} = useActionSheet();
  const {
    mutate: uploadPhoto,
    error: uploadPhotoError,
    isLoading,
    isSuccess,
    isError: isUploadPhotoError,
  } = useUploadPhotoOfId();

  const [image, setImage] = useState<Asset>();

  const validDocuments = [
    t('reuploadValidation.driversLicense'),
    t('reuploadValidation.idCard'),
    t('reuploadValidation.insuranceCard'),
  ];
  const photoOptions: CameraOptions | ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
    maxHeight: 1000,
    maxWidth: 1000,
    quality: 0.2,
  };

  useEffect(() => {
    if (isUploadPhotoError) {
      const message = uploadPhotoError?.response?.data.uploadFotoId.status.msg;

      Alert.alert('Something Went Wrong', message);
    }
  }, [isUploadPhotoError, uploadPhotoError]);

  const handleOpenActionSheet = () => {
    const options = [
      t('register.selectFromGallery'),
      t('register.takePicture'),
      t('register.cancel'),
    ];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          handleSelectImageFromLibrary();
        }

        if (buttonIndex === 1) {
          handleTakeAPicture();
        }
      },
    );
  };

  const handleTakeAPicture = () => {
    launchCamera(photoOptions, ({assets, didCancel}) => {
      if (!didCancel) {
        setImage(assets[0]);
      }
    });
  };

  const handleSelectImageFromLibrary = () => {
    launchImageLibrary(photoOptions, ({assets, didCancel}) => {
      if (!didCancel) {
        setImage(assets[0]);
      }
    });
  };

  const handleContinueButtonPressed = () => {
    if (!isMandansa) {
      setAuthenticatedUser({
        ...user,
        validationStatus: ValidationStatus.PENDING,
      });
    } else {
      queryClient.invalidateQueries(['mandansa', storedUser!.apuId]);
      goBack();
    }
  };

  const photoUploadBox = (
    <TouchableOpacity
      onPress={handleOpenActionSheet}
      style={styles.imageUploadBox}>
      {image === undefined ? (
        <FontAwesomeIcon icon={faPlusCircle} color="white" size={40} />
      ) : (
        <Image
          style={styles.image}
          resizeMode="cover"
          source={{uri: image?.uri!}}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <PageContainer variant="blue">
      {!isLoading ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}>
          {!isSuccess ? (
            <View style={styles.flex}>
              <TouchableOpacity
                onPress={() => (!isMandansa ? logoutUser() : goBack())}
                style={styles.logoutButton}>
                <Typography
                  color="#8b0000"
                  fontWeight="bold"
                  variant="b1"
                  text={
                    !isMandansa
                      ? t('reuploadValidation.logout')
                      : t('common.back')
                  }
                />
              </TouchableOpacity>
              <Typography
                variant="h2"
                color="white"
                text={t('reuploadValidation.uploadDocumentTitle', {
                  test: 'ok',
                })}
                fontWeight="bold"
                textStyle={styles.title}
              />
              <Typography
                variant="b1"
                fontWeight="600"
                textStyle={styles.rejectionExplanation}
                color="white"
                text={t('reuploadValidation.photoRejected', {
                  naam: `${user?.firstName} ${user?.naam}`,
                  idNumber: user?.idNummer,
                })}
              />
              <Typography
                variant="b1"
                fontWeight="600"
                color="white"
                text={t('reuploadValidation.uploadNewPictureBelow')}
              />
              <Typography
                variant="h3"
                fontWeight="bold"
                color="white"
                text={t('reuploadValidation.validDocuments')}
                textStyle={styles.validDocumentsTitle}
              />
              {validDocuments.map((document, index) => (
                <Typography
                  key={index}
                  text={`- ${document}`}
                  variant="b1"
                  fontWeight="600"
                  color="white"
                />
              ))}
              {photoUploadBox}
              <Button
                variant="secondary"
                disabled={!image}
                text={t('reuploadValidation.uploadPhoto')}
                onPress={() =>
                  uploadPhoto({
                    refId: user?.apuId,
                    rescanFotoId: true,
                    lang: user?.lang,
                    image: image?.base64,
                    apuId,
                  })
                }
              />
            </View>
          ) : (
            <View style={styles.successContainer}>
              <Image
                style={styles.successIcon}
                source={require('@assets/success_white.png')}
              />
              <Typography
                textStyle={styles.photoUploadedText}
                variant="h2"
                fontWeight="bold"
                color="white"
                text={t('reuploadValidation.photoUploaded')}
              />
              <Typography
                variant="b1"
                color="white"
                fontWeight="600"
                align="center"
                textStyle={styles.successExplainationText}
                text={t('reuploadValidation.photoUploadedSuccess')}
              />
              <Button
                buttonStyle={styles.continueButton}
                onPress={() => handleContinueButtonPressed()}
                variant="secondary"
                text={t('reuploadValidation.continueToApp')}
              />
              {!isMandansa && (
                <Button
                  onPress={() => logoutUser()}
                  variant="transparent"
                  text={t('reuploadValidation.logout')}
                />
              )}
            </View>
          )}
        </ScrollView>
      ) : (
        <Loader text="Uploading Photo..." />
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  title: {
    marginBottom: 20,
  },
  imageUploadBox: {
    borderWidth: 5,
    borderColor: 'white',
    borderStyle: 'dashed',
    borderRadius: 5,
    height: 225,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  validDocumentsTitle: {
    marginTop: 25,
    marginBottom: 10,
  },
  rejectionExplanation: {
    marginBottom: 15,
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
  },
  successIcon: {
    width: 200,
    height: 200,
  },
  photoUploadedText: {
    marginTop: 30,
  },
  successExplainationText: {
    marginVertical: 30,
  },
  continueButton: {
    marginBottom: 10,
  },
});

export default ReuploadValidationPhoto;
