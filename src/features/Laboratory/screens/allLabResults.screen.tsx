import React, {useState, useMemo, useEffect} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';

import {NavigationProp} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Loader, Typography, ErrorView, Button} from '@src/components';
import useTheme from '@hooks/useTheme';
import useAuthStore from '@stores/useAuthStore';

import {LabResult} from '../types/laboratory';
import useFetchAllLabResults from '../hooks/useFetchAllLabResults';
import LabResultItem from '../components/labResultItem';

interface Props {
  navigation: NavigationProp<any, string>;
  mdsId?: number;
}

const AllLabResultsScreen: React.FC<Props> = ({
  navigation: {navigate, goBack},
  mdsId,
}) => {
  const apuId = useAuthStore(state => state.user?.apuId);
  const [forceRefreshCache, setForceRefreshCache] = useState(false);

  const {t} = useTranslation();
  const {isLoading, isError, error, data, refetch, isFetching} =
    useFetchAllLabResults(apuId!, mdsId, forceRefreshCache);

  const theme = useTheme();

  const navigateToLabResult = (labResult: LabResult) => {
    navigate('LabResult', {labResult});
  };

  const labResults = useMemo(
    () =>
      data?.labUitslagen.data.reduce((acc: LabResult[], curr) => {
        const result = curr.uitslagen.data.map(results => ({
          ...results,
          lab: curr.uitslagen.lab,
        }));

        return [...acc, ...result];
      }, []),
    [data],
  );

  const keyExtractor = (_: LabResult, index: number) => `${index}`;

  const renderItem = ({item, index}: {index: number; item: LabResult}) => {
    return (
      <LabResultItem
        key={index}
        index={index}
        labResult={item}
        theme={theme}
        onLabResultPress={navigateToLabResult}
      />
    );
  };

  if (isLoading || (isError && isFetching)) {
    return (
      <Loader
        containerStyle={styles.container}
        textColor={theme.colors.primary}
        indicatorColor={theme.colors.primary}
        text={t('allLabResults.loadingLabResults')}
      />
    );
  }

  if (isError) {
    return <ErrorView goBack={goBack} reload={refetch} error={error} />;
  }

  if ((labResults?.length ?? -1) < 1) {
    return (
      <View style={styles.noItemsContainer}>
        <Typography
          textStyle={styles.noItemsText}
          variant="b1"
          text={t('allLabResults.noLabResults')}
        />
        <Button
          text={t('common.reload')}
          onPress={() => {
            setForceRefreshCache(true);
            refetch();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={labResults}
        onRefresh={() => {
          setForceRefreshCache(true);
          refetch();
        }}
        refreshing={isFetching}
        keyExtractor={keyExtractor}
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
  noItemsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noItemsText: {
    marginBottom: 20,
  },
});

export default AllLabResultsScreen;
