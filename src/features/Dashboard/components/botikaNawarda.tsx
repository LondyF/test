import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {useNavigation} from '@react-navigation/core';

import {Loader, Typography} from '@src/components';
import useTheme from '@src/hooks/useTheme';
import useAuthStore from '@src/stores/useAuthStore';
import {Theme} from '@src/styles';

import useFetchBotikaNaWarda from '../hooks/useFetchBotikaNaWarda';
import moment from 'moment';

const BotikaNaWarda = () => {
  const user = useAuthStore(state => state.user);
  const appTheme = useTheme();

  const {data, isLoading, isError} = useFetchBotikaNaWarda(user?.apuId || -1);
  const {navigate} = useNavigation();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loader
          indicatorColor={appTheme.colors.primary}
          textColor={appTheme.colors.primary}
          text="Loading botikas na warda"
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Typography
          variant="b1"
          align="center"
          text="Could't load botika na warda"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.botikaNaWardaHeader}>
        <Typography variant="h3" text="Boktika Na Warda" />
        <Typography
          textStyle={styles.botikaNaWardaDate}
          variant="h5"
          text={moment(data?.naWarda?.data?.datum || '').format('DD MMM YYYY')}
        />
      </View>
      <View style={styles.columnsContainer}>
        <TouchableOpacity
          onPress={() => navigate('Map', {data: [data?.naWarda.data.punda]})}
          style={styles.column}>
          <Typography
            variant="h5"
            textStyle={styles.columnHeaderText}
            text="punda"
          />
          <Typography
            textStyle={styles.columnBodyText}
            variant="h4"
            text={data?.naWarda?.data?.punda?.naam || ''}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigate('Map', {
              data: [data?.naWarda?.data?.otrobanda],
              type: 'pharmacy',
            })
          }
          style={styles.column}>
          <Typography
            variant="h5"
            textStyle={styles.columnHeaderText}
            text="otrobanda"
          />
          <Typography
            variant="h4"
            textStyle={styles.columnBodyText}
            text={data?.naWarda?.data?.otrobanda?.naam || ''}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderColor: Theme.colors.lightGray,
    borderWidth: 1,
    borderRadius: 5,
  },
  columnsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  column: {
    marginVertical: 10,
    flex: 1,
  },
  columnHeaderText: {
    marginVertical: 10,
    fontWeight: 'bold',
    color: Theme.colors.darkGray,
  },
  columnBodyText: {
    color: '#b8b8b8',
    fontWeight: 'bold',
  },
  botikaNaWardaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botikaNaWardaDate: {
    alignSelf: 'center',
  },
});

export default BotikaNaWarda;
