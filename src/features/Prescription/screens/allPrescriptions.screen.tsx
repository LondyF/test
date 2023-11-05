import React, {useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';

import {RouteProp, useNavigation} from '@react-navigation/native';
import {NavigationProp} from '@react-navigation/core';
import {useTranslation} from 'react-i18next';

import {Button, ErrorView, Loader, Typography} from '@src/components';
import {TransactionTypes} from '@src/constants';
import {Theme} from '@src/styles';
import useAuthStore from '@src/stores/useAuthStore';

import PrescriptionItem from '../components/PrescriptionItem';
import useFetchPrescriptions from '../hooks/useFetchPrescriptions';
import {Prescription} from '../prescription';
import {useEffect} from 'react';

interface Props {
  route: RouteProp<{params: {user: User; mdsId?: number}}, 'params'>;
  navigation: NavigationProp<{}>;
}

const AllPrescriptionsScreen: React.FC<Props> = ({
  route,
  navigation: {setOptions},
}) => {
  const navigation = useNavigation();
  const apuId = useAuthStore(state => state.user?.apuId);

  const {t} = useTranslation();
  const [isMandansa, setIsMandansa] = useState(false);
  const {data, isLoading, refetch, error, isFetching, isError} =
    useFetchPrescriptions(apuId!, route.params?.mdsId);

  useEffect(() => {
    if (route.params?.user === undefined) {
      return setOptions({
        title: t('prescriptions.myPrescriptions'),
      });
    }

    const mandansaUser = route.params.user;

    setIsMandansa(true);
    setOptions({
      title: `${mandansaUser.naam}'s ${t('prescriptions.prescriptions')}`,
    });
  }, [route, setOptions, t]);

  const onQRIconPressed = (prescription: Prescription) => {
    navigation.navigate('Identify', {
      data: prescription,
      id: prescription.recId,
      mdsId: route.params?.mdsId ?? 0,
      transactionType: isMandansa
        ? TransactionTypes.Mandansa
        : TransactionTypes.Recept,
      mdsUser: isMandansa && route.params.user,
    });
  };

  const renderItem = ({
    item: prescription,
    index,
  }: {
    item: Prescription;
    index: number;
  }) => {
    return (
      <PrescriptionItem
        onQRIconPressed={onQRIconPressed}
        index={index}
        prescription={prescription}
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (isError) {
      return (
        <View style={styles.noPrescriptionsFoundContainer}>
          <ErrorView
            goBack={() => navigation.goBack()}
            reload={refetch}
            error={error}
          />
        </View>
      );
    }

    return (
      <View style={styles.noPrescriptionsFoundContainer}>
        <Typography
          textStyle={styles.noPrescriptionsFoundText}
          text={t('prescriptions.noPrescriptionsFound')}
          variant="h4"
        />
        <Button onPress={() => refetch()} variant="primary" text="refresh" />
      </View>
    );
  };

  const keyExtractor = (_: Prescription, index: number) => `${index}`;

  const {
    colors: {primary},
  } = Theme;

  if (isLoading) {
    return (
      <Loader
        textColor={primary}
        indicatorColor={primary}
        text={t('prescriptions.loadingPrescriptions')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatListContent}
        onRefresh={refetch}
        refreshing={isFetching}
        keyExtractor={keyExtractor}
        data={data?.recepten}
        ListEmptyComponent={renderListEmptyComponent}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flatListContent: {
    flexGrow: 1,
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPrescriptionsFoundText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  noPrescriptionsFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default AllPrescriptionsScreen;
