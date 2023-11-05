import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import useAuthStore from '@stores/useAuthStore';
import {TransactionTypes} from '@src/constants';
import {Button, ErrorView, Loader, Typography} from '@src/components';
import useTheme from '@hooks/useTheme';

import useFetchAllLabRequests from '../hooks/useFetchAllLabRequests';
import LabRequestItem from '../components/labRequestItem';
import {LabRequest} from '../types/laboratory';

interface Props {
  navigation: NavigationProp<any, string>;
  mdsId?: number;
}

const AllLabRequestsScreen: React.FC<Props> = ({mdsId, navigation}) => {
  const [forceRefreshCache, setForceRefreshCache] = useState(false);

  const apuId = useAuthStore(state => state.user?.apuId);
  const theme = useTheme();

  const {t} = useTranslation();
  const {goBack} = useNavigation();
  const {isLoading, isError, error, data, refetch, isFetching} =
    useFetchAllLabRequests(apuId!, mdsId, forceRefreshCache);

  const {primary} = theme.colors;

  const keyExtractor = (_: LabRequest, index: number) => `${index}`;

  const renderItem = ({item, index}: {index: number; item: LabRequest}) => (
    <LabRequestItem
      theme={theme}
      onQRIconPressed={onQRIconPressed}
      onAppointmentIconPressed={onAppointmentIconPressed}
      labRequest={item}
      index={index}
    />
  );

  const onQRIconPressed = (labRequest: LabRequest) => {
    navigation.navigate('Identify', {
      data: labRequest,
      id: labRequest.avaId,
      transactionType: TransactionTypes.LabAanvraag,
    });
  };

  const onAppointmentIconPressed = (labRequest: LabRequest) => {
    navigation.navigate('HomeAppointment', {labRequest, mdsId: mdsId});
  };

  if (isLoading || (isError && isFetching)) {
    return (
      <Loader
        containerStyle={styles.container}
        textColor={primary}
        indicatorColor={primary}
        text={t('allLabRequests.loading')}
      />
    );
  }

  if (isError) {
    return <ErrorView goBack={goBack} reload={refetch} error={error} />;
  }

  if ((data?.aanvragen?.data?.length ?? -1) < 1) {
    return (
      <View style={styles.noItemsContainer}>
        <Typography
          textStyle={styles.noItemsText}
          variant="b1"
          text={t('allLabRequests.noLabRequestFound')}
        />
        <Button text={t('common.reload')} onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.aanvragen.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onRefresh={() => {
          setForceRefreshCache(true);
          refetch();
        }}
        refreshing={isFetching}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  noItemsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noItemsText: {
    marginBottom: 20,
  },
});

export default AllLabRequestsScreen;
