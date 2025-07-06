import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {View, StyleSheet, TouchableOpacity, Alert, Image} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faExclamationCircle,
  faCheckCircle,
} from '@fortawesome/pro-solid-svg-icons';
import {Button, Typography} from '@src/components';
import {EdgeInsets} from 'react-native-safe-area-context';
import useTheme from '@src/hooks/useTheme';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {
  DeclarationAdditionalInfo,
  type DeclarationAdditionalInfo as DeclarationAdditionalInfoType,
} from '../types/declarations';
import useSaveDeclarationPhoto from '../hooks/useSaveDeclarationPhoto';

type AdditionalInfo = {
  additionalInfo: string;
  additionalInfoId: DeclarationAdditionalInfoType;
  sesId: string;
  apuId: number;
};

export type ActionRequiredSheetRef = {
  present: (args: AdditionalInfo) => void;
  dismiss: () => void;
};

const WarningIcon = ({
  variant = 'warning',
}: {
  variant?: 'warning' | 'success';
}) => {
  const theme = useTheme();
  const styles = createStyles(useSafeAreaInsets());

  return (
    <View style={styles.warningIconContainer}>
      <FontAwesomeIcon
        icon={variant === 'warning' ? faExclamationCircle : faCheckCircle}
        size={80}
        color={theme.colors.primary}
      />
    </View>
  );
};

const PHOTO_OPTIONS: CameraOptions | ImageLibraryOptions = {
  mediaType: 'photo',
  includeBase64: true,
  maxHeight: 1000,
  maxWidth: 1000,
};

const ExplanationBody = ({
  explanation,
  boldCallToAction,
}: {
  explanation: string;
  boldCallToAction: string;
}) => {
  const styles = createStyles(useSafeAreaInsets());

  return (
    <>
      <Typography variant="b1" text={explanation} textStyle={styles.body} />
      <Typography
        variant="b1"
        text={boldCallToAction}
        textStyle={styles.boldBody}
        fontWeight="bold"
      />
    </>
  );
};

type ReuploadPhotoSheetContentState = 'initial' | 'upload_photo' | 'success';

const ReuploadPhotoSheetContent = ({
  onUpload,
  state,
  setState,
  onClose,
  additionalInfo,
  isPending,
}: {
  onUpload: (photo: Asset | null) => void;
  state: ReuploadPhotoSheetContentState;
  setState: (state: ReuploadPhotoSheetContentState) => void;
  onClose: () => void;
  additionalInfo: AdditionalInfo;
  isPending: boolean;
}) => {
  const {showActionSheetWithOptions} = useActionSheet();
  const styles = createStyles(useSafeAreaInsets());
  const [photo, setPhoto] = React.useState<Asset | null>(null);

  const handleTakeAPicture = () => {
    try {
      launchCamera(PHOTO_OPTIONS, async ({assets, didCancel}) => {
        if (!didCancel && !!assets) {
          setPhoto(assets?.[0] || null);
        }
      });
    } catch (e) {
      Alert.alert(
        'Oops',
        'Something went wrong opening your camera. Please check your permissions',
      );
    }
  };

  const uploadPhotoFromLibrary = () => {
    launchImageLibrary(PHOTO_OPTIONS, ({didCancel, assets}) => {
      if (didCancel) {
        return;
      }

      setPhoto(assets?.[0] || null);
    });
  };

  const handlePhotoBoxPress = () => {
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options: ['Take picture', 'Choose from gallery', 'cancel'],
        cancelButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          handleTakeAPicture();
        }

        if (buttonIndex === 1) {
          uploadPhotoFromLibrary();
        }
      },
    );
  };

  if (state === 'initial') {
    return (
      <View>
        <ExplanationBody
          explanation={additionalInfo?.additionalInfo ?? ''}
          boldCallToAction="Please review and correct the discrepancies to proceed."
        />
        <Button
          variant="primary"
          text="Upload photo"
          onPress={() => setState('upload_photo')}
        />
      </View>
    );
  }

  if (state === 'upload_photo') {
    return (
      <View>
        <Typography
          variant="b1"
          text="Please upload a clear photo of your receipt or document."
          fontSize={12}
          color="#585858"
          textStyle={styles.body}
        />
        <TouchableOpacity onPress={handlePhotoBoxPress} style={styles.photoBox}>
          {photo ? (
            <Image source={{uri: photo.uri}} style={styles.image} />
          ) : (
            <Typography
              variant="b1"
              text="Tap to upload a photo"
              fontWeight="bold"
              fontSize={12}
              color="#585858"
            />
          )}
        </TouchableOpacity>
        <Button
          loading={isPending}
          variant="primary"
          text="Upload photo"
          onPress={() => {
            onUpload(photo);
          }}
          disabled={!photo}
        />
      </View>
    );
  }

  if (state === 'success') {
    return (
      <View>
        <Typography
          variant="b1"
          text="The photo of your receipt or document has been submitted. Your declaration will continue progressing"
          textStyle={styles.body}
        />
        <Button variant="primary" text="Close" onPress={onClose} />
      </View>
    );
  }

  return null;
};

type ActionRequiredSheetProps = {};

const ActionRequiredSheet = forwardRef<
  ActionRequiredSheetRef,
  ActionRequiredSheetProps
>(({}, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);

  const {mutate: saveDeclarationPhoto, isPending} = useSaveDeclarationPhoto();

  const [additionalInfo, setAdditionalInfo] = React.useState<AdditionalInfo>();

  const [state, setState] = React.useState<
    'initial' | 'upload_photo' | 'success'
  >('initial');

  useImperativeHandle(ref, () => ({
    present: (args: AdditionalInfo) => {
      setAdditionalInfo(args);
      setState('initial');

      bottomSheetModalRef.current?.present();
    },
    dismiss: () => bottomSheetModalRef.current?.dismiss(),
  }));

  const BackdropComponent = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        style={styles.bottomsheetBackdrop}
      />
    ),
    [styles.bottomsheetBackdrop],
  );

  const onUpload = (photo: Asset | null) => {
    if (!photo) {
      return;
    }

    saveDeclarationPhoto(
      {
        sesId: additionalInfo?.sesId! ?? '',
        apuId: additionalInfo?.apuId!,
        imageBase64: photo.base64!,
      },
      {
        onSuccess: () => {
          setState('success');
        },
        onError: () => {
          Alert.alert(
            'Oops',
            'Something went wrong submitting your photo. Please try again.',
          );
        },
      },
    );
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      enableDynamicSizing={true}
      handleComponent={() => (
        <WarningIcon variant={state === 'success' ? 'success' : 'warning'} />
      )}
      backdropComponent={BackdropComponent}>
      <BottomSheetView style={styles.sheet}>
        <Typography
          variant="h3"
          fontWeight="bold"
          text={state === 'success' ? 'Document submitted' : 'Action Required'}
          textStyle={{textAlign: 'center'}}
        />
        {additionalInfo?.additionalInfoId ===
        DeclarationAdditionalInfo.FOTO_UNCLEAR ? (
          <ReuploadPhotoSheetContent
            onUpload={onUpload}
            onClose={() => {
              setState('initial');
              bottomSheetModalRef.current?.dismiss();
            }}
            state={state}
            setState={setState}
            additionalInfo={additionalInfo}
            isPending={isPending}
          />
        ) : (
          <>
            <ExplanationBody
              explanation={additionalInfo?.additionalInfo ?? ''}
              boldCallToAction="Please review and correct the discrepancies to proceed."
            />
            <Button
              variant="primary"
              text="Close"
              onPress={() => bottomSheetModalRef.current?.dismiss()}
            />
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const createStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    sheet: {
      paddingHorizontal: 20,
      paddingBottom: insets?.bottom || 20,
      paddingTop: 60,
    },
    warningIconContainer: {
      width: 110,
      height: 110,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      position: 'absolute',
      borderRadius: 55,
      top: -55,
      alignSelf: 'center',
    },
    body: {
      color: '#585858',
      marginTop: 20,
      marginBottom: 20,
    },
    boldBody: {
      color: '#444',
      marginBottom: 30,
    },
    bottomsheetBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 10,
    },
    photoBox: {
      height: 300,
      backgroundColor: 'rgba(80, 50, 159, 0.20)',
      borderRadius: 10,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ActionRequiredSheet;
