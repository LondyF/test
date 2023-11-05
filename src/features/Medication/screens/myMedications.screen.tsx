import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import useFetchMyMedications from '../hooks/useFetchMyMedications';
import {Medicine} from '../types/medication';

import {Button, ErrorView, ListItem, Loader, Typography} from '@src/components';
import {Theme} from '@src/styles';
import {convertISOdate} from '@src/utils/utils';
import {useNavigation} from '@react-navigation/native';
import useTheme from '@hooks/useTheme';
import useAuthStore from '@src/stores/useAuthStore';

const MyMedications = () => {
  const user = useAuthStore(state => state.user);
  const navigation = useNavigation();
  const theme = useTheme();
  const {t} = useTranslation();

  const {data, isLoading, refetch, isFetching, isError, error} =
    useFetchMyMedications(user?.apuId || -1);

  const keyExtractor = (_: Medicine, index: number) => `${index}`;

  const renderItem = ({
    item: medicine,
    index,
  }: {
    item: Medicine;
    index: number;
  }) => {
    return (
      <ListItem style={styles.itemContainer} index={index}>
        <View style={styles.flexRow}>
          <View style={styles.flex}>
            <Typography
              text={medicine.medNaam}
              variant="h4"
              color={theme.colors.darkGray}
              fontWeight="bold"
            />
          </View>
          <Typography
            text={convertISOdate(medicine.lastDt)}
            variant="h5"
            color="#b8b8b8"
          />
        </View>
        <Typography
          text={medicine.dosering}
          variant="h4"
          color={theme.colors.darkGray}
        />
      </ListItem>
    );
  };

  const renderListEmptyComponent = () => {
    if (isError) {
      return (
        <View style={styles.errorViewContainer}>
          <ErrorView
            error={error}
            reload={refetch}
            goBack={() => navigation.goBack()}
          />
        </View>
      );
    }

    return (
      <View style={styles.noMedicineFoundContainer}>
        <Typography
          textStyle={styles.noMedicineFoundText}
          text={t('myMedication.noMedicationsFound')}
          variant="h4"
        />
        <Button onPress={() => refetch()} variant="primary" text="refresh" />
      </View>
    );
  };

  if (isLoading || (isError && isFetching)) {
    return (
      <Loader
        containerStyle={styles.container}
        textColor={theme.colors.primary}
        indicatorColor={theme.colors.primary}
        text={t('myMedication.loadingMedications')}
      />
    );
  }

  if (isError) {
    return <ErrorView goBack={() => {}} reload={refetch} error={error} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography
          variant="b1"
          color={theme.colors.darkGray}
          text={`${t('common.name')}: ${user?.naam}`}
        />
        <Typography
          variant="b1"
          color={theme.colors.darkGray}
          text={`${t('common.dateOfBirth')}: ${convertISOdate(user!.dob)} `}
        />
        <Typography
          variant="b1"
          color={theme.colors.darkGray}
          text={`${t('common.gender')}: ${user?.sex}`}
        />
        <Typography
          fontWeight="bold"
          variant="b1"
          color={theme.colors.darkGray}
          text={t('myMedication.lastSixMonths')}
        />
      </View>
      <SafeAreaView style={styles.content}>
        <FlatList
          contentContainerStyle={styles.flatListContent}
          refreshing={isFetching}
          onRefresh={() => refetch()}
          keyExtractor={keyExtractor}
          data={data?.medicijnlijst}
          renderItem={renderItem}
          ListEmptyComponent={renderListEmptyComponent}
        />
      </SafeAreaView>
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingVertical: 10,
  },
  header: {
    flex: 0.15,
    justifyContent: 'space-evenly',
    paddingHorizontal: Theme.spacing.horizontalPadding,
  },
  content: {
    alignContent: 'center',
    paddingVertical: 10,
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
  flexRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  itemContainer: {
    paddingVertical: 20,
    paddingHorizontal: Theme.spacing.horizontalPadding,
  },
  noMedicineFoundText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  noMedicineFoundContainer: {
    marginTop: windowHeight / 4,
    alignItems: 'center',
  },
  errorViewContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default MyMedications;
