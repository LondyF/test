import React from 'react';
import {FlatList, View, StyleSheet} from 'react-native';

import {useTranslation} from 'react-i18next';

import {Button, ErrorView, ListItem, Loader, Typography} from '@src/components';
import {Theme} from '@styles/styles';
import useTheme from '@hooks/useTheme';
import useAuthStore from '@stores/useAuthStore';
import {convertISOdate} from '@utils/utils';

import useFetchAllDoctorReferrals from '../hooks/useFetchAllDoctorReferrals';
import {Referral} from '../types/referrals';

interface Props {
  mdsId: number;
}

const AllDoctorReferrals: React.FC<Props> = ({mdsId}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const user = useAuthStore(state => state.user);

  const {t} = useTranslation();
  const {isLoading, data, isError, error, isFetching, refetch} =
    useFetchAllDoctorReferrals(user!.apuId, mdsId);

  const renderItem = ({item, index}: {index: number; item: Referral}) => (
    <ListItem style={styles.itemContainer} index={index}>
      <View style={styles.flexRow}>
        <Typography text={item.art2Vakgroep} variant="h4" fontWeight="bold" />
        <Typography
          text={convertISOdate(item.datum)}
          variant="h5"
          color="#b8b8b8"
        />
      </View>

      <Typography
        textStyle={styles.diagnose}
        text={item.diagnose}
        fontStyle="italic"
        variant="h5"
      />

      <View style={styles.vakGroep}>
        <View style={styles.flexRowAlignCenter}>
          <Typography
            color={theme.colors.primary}
            fontWeight="bold"
            variant="b1"
            text={t('allDoctorReferral.from') + ': '}
          />
          <Typography
            text={item.aanvrager}
            variant="b1"
            color={theme.colors.darkGray}
            fontWeight="bold"
          />
          <Typography
            text={` (${t('allMachtigingen.familyDoctor')})`}
            variant="h5"
            color="#b8b8b8"
          />
        </View>
      </View>

      <View style={styles.flexRowAlignCenter}>
        <Typography
          color={theme.colors.primary}
          fontWeight="bold"
          variant="b1"
          text={t('allDoctorReferral.to') + ': '}
        />
        <Typography
          text={item.art2Naam}
          variant="b1"
          color={theme.colors.darkGray}
          fontWeight="bold"
        />
      </View>

      <Typography
        textStyle={styles.route}
        variant="b1"
        fontWeight="600"
        text={item.route}
      />

      <Typography
        variant="b1"
        fontSize={12}
        fontWeight="400"
        text={item.vzk_status}
        fontStyle="italic"
      />
    </ListItem>
  );

  const keyExtractor = (_: Referral, index: number) => `${index}`;

  if (isLoading || (isError && isFetching)) {
    return (
      <Loader
        containerStyle={styles.container}
        textColor={theme.colors.primary}
        indicatorColor={theme.colors.primary}
        text={t('allDoctorReferral.loadingReferrals')}
      />
    );
  }

  if (isError) {
    return <ErrorView goBack={() => {}} reload={refetch} error={error} />;
  }

  if ((data?.verwijzingen?.length ?? -1) <= 0) {
    return (
      <View style={styles.noItemsContainer}>
        <Typography
          textStyle={styles.noItemsText}
          variant="b1"
          text={t('allDoctorReferral.noReferralsFound')}
        />
        <Button text={t('common.reload')} onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.verwijzingen}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onRefresh={refetch}
        refreshing={isFetching}
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
    flexRowAlignCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    diagnose: {
      marginTop: 5,
    },
    vakGroep: {
      marginVertical: 10,
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    itemContainer: {
      paddingHorizontal: theme.spacing.horizontalPadding,
      paddingVertical: 15,
    },
    route: {
      marginTop: 10,
      marginBottom: 5,
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

export default AllDoctorReferrals;
