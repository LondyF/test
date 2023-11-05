import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlusCircle} from '@fortawesome/pro-light-svg-icons';
import {UseMutateFunction} from '@tanstack/react-query';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useTranslation} from 'react-i18next';
import {AxiosError} from 'axios';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {Typography, Button} from '@components/index';

import {Action, ActionKind} from '../register.screen';

interface UploadIdStepProps {
  dispatch: React.Dispatch<Action>;
  uploadPhotoId: UseMutateFunction<
    UploadPhotoOfIdResponse,
    AxiosError<UploadPhotoOfIdResponse>,
    any,
    unknown
  >;
  lang: Language['abbreviation'];
  apuId: number;
}

const UploadIdStep: React.FC<UploadIdStepProps> = ({
  dispatch,
  uploadPhotoId,
  lang,
  apuId,
}) => {
  const {t} = useTranslation();
  const {showActionSheetWithOptions} = useActionSheet();
  const photoOptions: CameraOptions | ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
    maxHeight: 1000,
    maxWidth: 1000,
    quality: 0.2,
  };

  const [image, setImage] = useState<Asset>();

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

  const handleSubmit = () => {
    dispatch({
      type: ActionKind.SET_BUSY,
      payload: true,
    });

    return uploadPhotoId({apuId, lang, image: image?.base64, refId: apuId});
  };

  return (
    <View style={styles.container}>
      <Typography
        variant="b1"
        fontWeight="bold"
        align="center"
        color="white"
        text={t('register.takePictureOfId')}
      />
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
      <Button
        variant="secondary"
        text={t('register.next')}
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  imageUploadBox: {
    borderWidth: 5,
    borderColor: 'white',
    borderStyle: 'dashed',
    borderRadius: 5,
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    backgroundColor: 'red',
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});

export default UploadIdStep;
