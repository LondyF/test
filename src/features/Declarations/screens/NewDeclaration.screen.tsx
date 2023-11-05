import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';

import Modal from 'react-native-modal';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useTranslation} from 'react-i18next';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
  PhotoQuality,
} from 'react-native-image-picker';
import {NavigationProp} from '@react-navigation/native';
import {faSave} from '@fortawesome/pro-regular-svg-icons';

import {
  FloatingActionButton,
  Loader,
  PageContainer,
  Typography,
} from '@src/components';
import useTheme from '@src/hooks/useTheme';
import useAuthStore from '@src/stores/useAuthStore';
import usePermissions, {Permissions} from '@src/hooks/usePermissions';
import useToast from '@src/components/Toast/useToast';
import {ToastTypes} from '@src/components/Toast/toastTypes';
import {Theme} from '@src/styles/styles';
import {deleteTmpFolder} from '@utils/index';

import NewDeclarationModal from '../components/NewDeclarationModal';
import AddImageViewBorder from '../components/AddImageViewBorder';
import AddPhotoModal from '../components/AddPhotoModal';
import useSaveDeclaration from '../hooks/useSaveDeclaration';

interface IProps {
  navigation: NavigationProp<{}>;
}

export interface DeclarationPhoto {
  image: Asset;
  amount: number;
  selectedScanType: string;
  selectedScanTypeId: number;
  id: number;
}

const NewDeclarationScreen: React.FC<IProps> = ({
  navigation: {setOptions, addListener},
}) => {
  const {t} = useTranslation();
  const user = useAuthStore(state => state.user);
  const Toast = useToast();

  const {showActionSheetWithOptions} = useActionSheet();
  const {mutateAsync, isLoading} = useSaveDeclaration();
  const [hasCameraPermissions] = usePermissions(Permissions.camera);

  const [showModal, setShowModal] = useState(true);
  const [catalogName, setCatalogName] = useState('');
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [declarationPhotos, setDeclarationPhotos] = useState<
    Array<DeclarationPhoto>
  >([]);
  const [newImage, setNewImage] = useState<DeclarationPhoto>(
    {} as DeclarationPhoto,
  );
  const [selectedImage, setSelectedImage] = useState<string>();

  const appTheme = useTheme();
  const styles = makeStyles(appTheme);

  useEffect(() => {
    setSelectedImage(
      declarationPhotos.length ? declarationPhotos[0].image.uri : '',
    );
  }, [declarationPhotos]);

  useEffect(() => {
    const unsubscribe = addListener('blur', () => {
      deleteTmpFolder();
    });

    return unsubscribe;
  }, [addListener]);

  const photoOptions: CameraOptions | ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
    maxHeight: 1000,
    maxWidth: 1000,
    quality: user?.imgComp as PhotoQuality,
  };

  function createNewDeclarationSubmit(newCatalogName: string) {
    setOptions({title: newCatalogName});
    setCatalogName(newCatalogName);
    setShowModal(false);
  }

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
    try {
      if (hasCameraPermissions) {
        launchCamera(photoOptions, ({assets, didCancel}) => {
          if (!didCancel) {
            initNewDeclarationPhoto(assets[0]);
          }
        });
      } else {
        Alert.alert('No permissions', 'No permissions to use camera');
      }
    } catch {
      Alert.alert('Action not supported');
    }
  };

  const handleSelectImageFromLibrary = () => {
    launchImageLibrary(photoOptions, ({assets, didCancel}) => {
      if (!didCancel) {
        initNewDeclarationPhoto(assets[0]);
      }
    });
  };

  const initNewDeclarationPhoto = (asset: Asset) => {
    let declarationPhoto: DeclarationPhoto = {
      image: asset,
      selectedScanType: '',
      selectedScanTypeId: 1,
      amount: 0,
      id: 0,
    };
    setNewImage(declarationPhoto);
    setShowModal(true);
    setShowAddPhotoModal(true);
  };

  const declineButtonPressed = (id: number, isNewDeclarationPhoto: boolean) => {
    setShowModal(false);
    if (!isNewDeclarationPhoto) {
      setDeclarationPhotos(declarationPhotos.filter(x => x.id !== id));
    }
  };

  const acceptButtonPressed = (
    declarationPhoto: DeclarationPhoto,
    isNewDeclarationPhoto: boolean,
  ) => {
    setShowModal(false);
    isNewDeclarationPhoto
      ? setDeclarationPhotos(prevPhotos => [declarationPhoto, ...prevPhotos])
      : changeDeclarationPhotoInformation(declarationPhoto);
  };

  const changeDeclarationPhotoInformation = (
    declarationPhoto: DeclarationPhoto,
  ) => {
    setDeclarationPhotos(
      declarationPhotos.map(x =>
        x.id === declarationPhoto.id ? declarationPhoto : x,
      ),
    );
  };

  const pressedPhoto = (id: number) => {
    let declarationPhoto = declarationPhotos.find(x => x.id === id);
    if (declarationPhoto) {
      setNewImage(declarationPhoto);
      setShowModal(true);
    }
  };

  const saveDeclaration = async () => {
    const response = await mutateAsync({
      catalogName,
      apuId: user?.apuId || -1,
      declarationPhotos: declarationPhotos,
    });

    if (response.scan.status.status === 0) {
      Toast('Successfully created', ToastTypes.SUCCESS);
    } else {
      Toast(response.scan.status.msg, ToastTypes.ERROR);
    }
  };

  if (isLoading) {
    return (
      <Loader
        textColor={appTheme.colors.primary}
        indicatorColor={appTheme.colors.primary}
        text="Saving declaration..."
      />
    );
  }

  return (
    <PageContainer style={styles.mainContainer} variant="none">
      <Modal isVisible={showModal}>
        {!showAddPhotoModal ? (
          <NewDeclarationModal
            createNewCatalog={createNewDeclarationSubmit}
            setShowModal={setShowModal}
          />
        ) : (
          <AddPhotoModal
            acceptButton={acceptButtonPressed}
            declineButton={declineButtonPressed}
            declarationPhoto={newImage}
          />
        )}
      </Modal>
      <View style={styles.topSection}>
        <Typography
          variant="h2"
          fontWeight="500"
          text={t('newDeclaration.title')}
        />
        <Typography
          variant="b1"
          fontWeight="500"
          textStyle={styles.infoText}
          text={t('newDeclaration.introduction')}
        />
      </View>
      <View style={styles.midSection}>
        <View style={styles.flex}>
          <AddImageViewBorder
            image={selectedImage}
            onPress={!selectedImage ? handleOpenActionSheet : undefined}
          />
        </View>
      </View>
      <View style={styles.bottomSection}>
        {declarationPhotos.length > 0 && (
          <ScrollView
            horizontal
            contentContainerStyle={styles.infoText}
            style={styles.flex}>
            <View style={styles.imageContainer}>
              <AddImageViewBorder
                onPress={handleOpenActionSheet}
                style={styles.image}
              />
            </View>
            {declarationPhotos.map(x => (
              <View style={styles.imageContainer}>
                <View style={styles.photoBottomContainer}>
                  <Typography
                    fontWeight="bold"
                    variant="b1"
                    color="white"
                    text={x.selectedScanType}
                  />
                  <Typography
                    fontWeight="500"
                    variant="b1"
                    color="white"
                    text={`NAF: ${x.amount}`}
                  />
                </View>
                <AddImageViewBorder
                  onPress={() => pressedPhoto(x.id)}
                  image={x.image.uri}
                  style={styles.image}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <FloatingActionButton
        disabled={declarationPhotos.length === 0}
        onPress={saveDeclaration}
        buttonColor={appTheme.colors.primary}
        icon={faSave}
      />
    </PageContainer>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    infoText: {
      textAlign: 'center',
      marginTop: 10,
    },
    mainContainer: {
      backgroundColor: 'white',
      flex: 1,
    },
    topSection: {
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    midSection: {
      flex: 0.35,
      paddingHorizontal: 35,
    },
    imageContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      alignContent: 'center',
      width: 130,
      height: 130,
      marginRight: 15,
    },
    scrollViewContent: {
      alignItems: 'center',
    },
    image: {
      width: 130,
      height: 130,
    },
    bottomSection: {
      flex: 0.35,
    },
    photoBottomContainer: {
      backgroundColor: '#00000095',
      height: 45,
      bottom: 0,
      left: 0,
      zIndex: 1,
      right: 0,
      position: 'absolute',
      paddingHorizontal: 10,
      paddingVertical: 1,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
  });

export default NewDeclarationScreen;
