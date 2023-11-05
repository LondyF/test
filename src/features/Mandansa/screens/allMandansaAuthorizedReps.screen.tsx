import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';

import {faQrcode} from '@fortawesome/pro-regular-svg-icons';
import {useNavigation} from '@react-navigation/core';
import {useQueryClient} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';

import useAuthStore from '@stores/useAuthStore';
import useTheme from '@hooks/useTheme';
import useInternetConnection from '@hooks/useInternetConnection';
import useToast from '@components/Toast/useToast';
import {TransactionTypes} from '@src/constants';
import {ToastTypes} from '@components/Toast/toastTypes';
import {
  Loader,
  Typography,
  ListItem,
  FloatingActionButton,
  Button,
  ErrorView,
} from '@src/components';
import {Theme} from '@styles/styles';

import useFetchMandansas from '../hooks/useFetchMandansas';
import useChangeMandansaStatus from '../hooks/useChangeMandansaStatus';
import TikkieRequestModal from '../components/tikkieRequestModal';
import {MandansaRelation} from '../types/mandansa';
import {MandansaStatus} from '../types/mandansaStatus';

interface Props {
  mdsUser: User;
  mdsId: number;
  hasToAcceptMandansaRequest: boolean;
}

const AllMandansaAuthorizedRepsScreen: React.FC<Props> = ({
  hasToAcceptMandansaRequest,
  mdsUser,
  mdsId,
}) => {
  const {t} = useTranslation();
  const {navigate, goBack} = useNavigation();

  const apuId = useAuthStore(state => state.user?.apuId);
  const theme = useTheme();
  const styles = makeStyles(theme);
  const queryClient = useQueryClient();
  const toast = useToast();

  const [isTikkieRequestModalOpen, setIsTikkieRequestModalOpen] = useState(
    hasToAcceptMandansaRequest,
  );

  const {mutateAsync: changeMandansaStatus} = useChangeMandansaStatus();
  const {checkIfConnected} = useInternetConnection();
  const {isLoading, data, isError, refetch, error, isFetching} =
    useFetchMandansas(apuId!);
  const {primary, darkGray} = theme.colors;

  useEffect(() => {
    setIsTikkieRequestModalOpen(hasToAcceptMandansaRequest);
  }, [hasToAcceptMandansaRequest]);

  const handleMandansaConfirmation = async (accepted: boolean) => {
    try {
      setIsTikkieRequestModalOpen(false);

      //@ts-ignore
      const relation: MandansaRelation = {
        mdsId: mdsId,
        mdsStatus: accepted
          ? MandansaStatus.VALIDATED
          : MandansaStatus.REJECTED,
        mdsTKP: mdsUser,
        relNaam: 'New Relation',
      };

      await changeMandansaStatus({relation});

      queryClient.invalidateQueries('mandansa');
    } catch (e) {
      //@ts-ignore
      toast(e.response.data.mandansa.status.msg, ToastTypes.ERROR);
    }
  };

  const promptCancelMandansa = (relation: MandansaRelation) => {
    Alert.alert(
      t('common.areYouSure'),
      t('mandansaDetail.wannaCancelRelation', {
        name: (relation.mdsTKP as User).naam,
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
          onLongPress={() => promptCancelMandansa(item)}
          style={styles.itemContainer}>
          <Image
            source={{uri: (item.mdsTKP as User).foto}}
            style={styles.profilePic}
          />
          <View style={styles.userInfoContainer}>
            <Typography
              text={(item.mdsTKP as User).naam}
              variant="h4"
              color={darkGray}
              fontWeight="bold"
            />
            <Typography text={item.relNaam} variant="h4" color="#b8b8b8" />
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
    <View style={styles.container}>
      <TikkieRequestModal
        requestingUser={mdsUser ?? {}}
        isVisible={isTikkieRequestModalOpen}
        theme={theme}
        onAccept={() => handleMandansaConfirmation(true)}
        onReject={() => handleMandansaConfirmation(false)}
      />
      <FlatList
        contentContainerStyle={styles.flatList}
        data={data?.mandansa?.gemachtigde?.filter(x => x.mdsTKP != null)}
        onRefresh={() => refetch()}
        refreshing={isFetching}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderListEmptyComponent}
        renderItem={renderItem}
      />
      <FloatingActionButton
        onPress={() =>
          checkIfConnected(() => {
            navigate('Identify', {
              data: {},
              transactionType: TransactionTypes.PermanenteTikkie,
            });
          })
        }
        icon={faQrcode}
        buttonColor={theme.colors.primary}
      />
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    flatList: {
      flex: 1,
    },
    itemContainer: {
      paddingHorizontal: theme.spacing.horizontalPadding,
      paddingVertical: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    userInfoContainer: {
      marginLeft: 15,
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
      backgroundColor: theme.colors.primary,
    },
    emptyListContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.horizontalPadding,
    },
    emptyListText: {
      textAlign: 'center',
      marginBottom: 15,
    },
  });

export default AllMandansaAuthorizedRepsScreen;
