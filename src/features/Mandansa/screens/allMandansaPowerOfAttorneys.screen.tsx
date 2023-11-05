import React, {useState} from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';

import {faPlus} from '@fortawesome/pro-regular-svg-icons';
import {useNavigation} from '@react-navigation/core';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useTranslation} from 'react-i18next';
import {BarCodeReadEvent} from 'react-native-camera';
import {useQueryClient} from '@tanstack/react-query';

import useAuthStore from '@src/stores/useAuthStore';
import useToast from '@components/Toast/useToast';
import {ToastTypes} from '@components/Toast/toastTypes';
import {
  Loader,
  Typography,
  ListItem,
  FloatingActionButton,
  ErrorView,
  Button,
} from '@src/components';
import {Theme} from '@styles/index';
import {insert} from '@utils/utils';
import useInternetConnection from '@hooks/useInternetConnection';
import useTheme from '@hooks/useTheme';

import useFetchMandansas from '../hooks/useFetchMandansas';
import useScanMandansaQR from '../hooks/useScanMandansaQR';
import useChangeMandansaStatus from '../hooks/useChangeMandansaStatus';
import {MandansaRelation} from '../types/mandansa';
import {MandansaMsgStatus, MandansaStatus} from '../types/mandansaStatus';
import ScanQRCodeModal from '../components/scanQRCodeModal';

type mandansaOption = {
  name: string;
  pageKey: string | null;
  stack: string | null;
};

const AllMandansaPowerOfAttorneysScreen: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);

  const apuId = useAuthStore(state => state.user?.apuId);
  const toast = useToast();
  const queryClient = useQueryClient();

  const {showActionSheetWithOptions} = useActionSheet();
  const {checkIfConnected} = useInternetConnection();
  const {t} = useTranslation();
  const {navigate, goBack} = useNavigation();
  const {isLoading, data, error, isError, refetch, isFetching} =
    useFetchMandansas(apuId!);
  const {mutateAsync: changeMandansaStatus} = useChangeMandansaStatus();
  const {mutateAsync} = useScanMandansaQR();
  const {primary, darkGray, lightGray} = Theme.colors;
  const appTheme = useTheme();

  const BASE_OPTIONS: mandansaOption[] = [
    {
      name: t('mandansaDetail.prescriptions'),
      pageKey: 'AllPrescriptions',
      stack: 'Prescriptions',
    },
    {name: t('mandansaDetail.cancel'), pageKey: null, stack: null},
  ];

  const MANDANSA_OPTIONS = [
    {
      name: t('mandansaDetail.lab'),
      pageKey: 'LabRequests',
      stack: 'LabRequests',
    },
    {
      name: t('mandansaDetail.referrals'),
      pageKey: 'AllReferrals',
      stack: 'App',
    },
    // { name: 'Afspraakjes', pageKey: t('appointments.myAppointments'), stack: 'AllAppointments' },
  ];

  const getOptionsByRelationType = (
    relationType: MandansaRelation['mdsTKP'],
  ) => {
    const isChild = (relationType as string).toUpperCase() === 'K';

    if (!isChild) {
      return BASE_OPTIONS;
    }

    return insert(BASE_OPTIONS, 1, MANDANSA_OPTIONS);
  };

  const handleOpenActionSheet = (index: number) => {
    const mandansaRelation = data?.mandansa.volmacht[index];
    const mdsId = mandansaRelation?.mdsId;
    const mdsUser = mandansaRelation?.apuuser;
    const options: mandansaOption[] = getOptionsByRelationType(
      mandansaRelation!.mdsTKP,
    );
    const optionsLabels = options.map(x => x.name);
    const cancelButtonIndex = options.length - 1;

    if (mandansaRelation!.mdsMsgStatus === MandansaMsgStatus.PHOTO_REJECTED) {
      navigate('ReuploadValidationPhoto', {
        mandansaUser: mandansaRelation?.apuuser,
      });
      return;
    }

    if (mandansaRelation!.isGevalideerd <= 0) {
      Alert.alert(t('common.error'), t(mandansaRelation!.mdsMsg));
      return;
    }

    showActionSheetWithOptions(
      {
        options: optionsLabels,
        cancelButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex === cancelButtonIndex) {
          return;
        }

        const option = options[buttonIndex ?? 0];

        navigate(option.stack!, {
          screen: option.pageKey,
          params: {mdsId, user: mdsUser},
        });
      },
    );
  };

  const handleOpenAddMandansaActionSheet = () => {
    checkIfConnected(() => {
      const cancelButtonIndex = 2;

      showActionSheetWithOptions(
        {
          options: [
            t('mandansaDetail.registerMandansa'),
            t('mandansaDetail.scanQRCode'),
            t('common.cancel'),
          ],
          cancelButtonIndex,
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            navigate('RegisterMandansa');
          }

          if (buttonIndex === 1) {
            setIsScanning(true);
          }

          if (buttonIndex === cancelButtonIndex) {
            return;
          }
        },
      );
    });
  };

  const onQRScan = async (e: BarCodeReadEvent) => {
    try {
      setIsScanning(false);

      const {data: QRCodeData} = e;
      const [uuId, apuMdsId, recId] = QRCodeData.replace('SQ:', '')
        .split('//')
        .map(x => +x);

      await mutateAsync({uuId, recId, apuId: apuId || -1, apuMdsId});
    } catch (err) {
      //@ts-ignore
      const errorMsg = err.response.data.transaktie.status.msg;

      toast(errorMsg, ToastTypes.ERROR);
    }
  };

  const promptCancelMandansa = (relation: MandansaRelation) => {
    Alert.alert(
      t('common.areYouSure'),
      t('mandansaDetail.wannaCancelRelation', {
        name: relation.apuuser.naam,
      }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
          onPress: () => null,
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            relation.mdsStatus = MandansaStatus.CANCELED;

            await changeMandansaStatus({
              relation,
            });

            queryClient.invalidateQueries(['mandansa', apuId]);
          },
        },
      ],
    );
  };

  const keyExtractor = (_: MandansaRelation, index: number) => `${index}`;

  const renderItem = ({
    item,
    index,
  }: {
    index: number;
    item: MandansaRelation;
  }) => {
    return (
      <ListItem index={index}>
        <TouchableOpacity
          onPress={() => handleOpenActionSheet(index)}
          onLongPress={() => promptCancelMandansa(item)}
          style={styles.itemContainer}>
          <Image source={{uri: item.apuuser.foto}} style={styles.profilePic} />
          <View style={styles.userInfoContainer}>
            <View style={styles.mandansaNameContainer}>
              <Typography
                text={item.apuuser.naam + ' '}
                variant="h4"
                color={darkGray}
                fontWeight="bold"
              />
              <Typography
                text={`#${item.apuuser.idNummer}`}
                variant="h5"
                fontStyle="italic"
                color={lightGray}
              />
            </View>
            <Typography text={item.relNaam} variant="h4" color="#b8b8b8" />
            {item.isGevalideerd <= 0 && (
              <Typography
                fontWeight="bold"
                text={t(item.mdsMsg)}
                variant="h6"
                color={appTheme.colors.primary}
              />
            )}
          </View>
        </TouchableOpacity>
      </ListItem>
    );
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Typography
          textStyle={styles.emptyListText}
          text={t('mandansaDetail.noMandansaFound')}
          variant="h4"
        />
        <Button
          onPress={() => refetch()}
          variant="primary"
          text={t('common.reload')}
        />
      </View>
    );
  };

  if (isLoading || (isError && isFetching)) {
    return (
      <Loader
        containerStyle={styles.container}
        textColor={primary}
        indicatorColor={primary}
        text={t('mandansaDetail.loadingMandansas')}
      />
    );
  }

  if (isError) {
    return <ErrorView goBack={goBack} reload={refetch} error={error} />;
  }

  return (
    <>
      <ScanQRCodeModal
        isVisisble={isScanning}
        onScan={onQRScan}
        onCancel={() => setIsScanning(false)}
      />
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.flatList}
          data={data?.mandansa?.volmacht}
          ListEmptyComponent={renderListEmptyComponent}
          onRefresh={() => refetch()}
          refreshing={isFetching}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
        <FloatingActionButton
          buttonColor={appTheme.colors.primary}
          onPress={handleOpenAddMandansaActionSheet}
          icon={faPlus}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    paddingHorizontal: Theme.spacing.horizontalPadding,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoContainer: {
    paddingLeft: 15,
    flex: 1,
    alignItems: 'flex-start',
  },
  mandansaNameContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  addButton: {
    position: 'absolute',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    right: 20,
    height: 60,
    borderRadius: 30,
    elevation: 1,
    backgroundColor: Theme.colors.primary,
  },
  qrScannerContainer: {
    backgroundColor: 'green',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.horizontalPadding,
  },
  emptyListText: {
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default AllMandansaPowerOfAttorneysScreen;
