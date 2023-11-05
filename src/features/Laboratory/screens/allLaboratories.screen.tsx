import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';

import {faMapMarkedAlt, faSearch} from '@fortawesome/pro-solid-svg-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/core';

import {
  Typography,
  Loader,
  TextInput,
  ListItem,
  FloatingActionButton,
  ErrorView,
} from '@src/components';
import {useUserLocation} from '@hooks/useUserLocation';
import {Theme} from '@src/styles';
import useTheme from '@src/hooks/useTheme';
import useAuthStore from '@stores/useAuthStore';

import useFetchLaboratories from '../hooks/useFetchLaboratories';
import {Laboratory} from '../types/laboratory';

const AllLaboratoriesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const apuId = useAuthStore(state => state.user?.apuId);
  const theme = useTheme();

  const {navigate} = useNavigation();
  const {t} = useTranslation();

  const {data, isLoading, isError, error, isFetching, refetch, status} =
    useFetchLaboratories(apuId!);
  const {calculateDistanceFromUser} = useUserLocation();
  const [filteredLabs, setFilteredLabs] = useState<Laboratory[]>([]);

  useEffect(() => {
    if (data && status === 'success') {
      setFilteredLabs(data.prikpost.prikposten);
    }
  }, [data, status]);

  const {
    colors: {darkGray, primary},
  } = Theme;

  const keyExtractor = (_: Laboratory, index: number) => `${index}`;

  const navigateToMap = (item: Laboratory) => {
    navigate('Map', {data: [item]});
  };

  const renderItem = ({index, item}: {index: number; item: Laboratory}) => {
    let km = calculateDistanceFromUser(item.lat, item.lng);
    return (
      <TouchableOpacity onPress={() => navigateToMap(item)}>
        <ListItem index={index} style={styles.ItemContainer}>
          <Typography
            variant="h5"
            textStyle={styles.labName}
            text={item.grpNaam2}
            color="#b8b8b8"
          />
          <View style={styles.textContainer}>
            <Typography
              variant="h3"
              fontWeight="500"
              text={item.naam}
              color={darkGray}
            />
            <Typography
              variant="h3"
              textStyle={styles.kmText}
              fontWeight="500"
              text={km === -1 ? 'N/A' : km.toString() + 'km'}
              color="#b8b8b8"
            />
          </View>
          <Typography
            textStyle={styles.address}
            variant="h4"
            text={item.adres}
            color="#b8b8b8"
          />
          <Typography variant="h4" text={item.openClose} color="#b8b8b8" />
        </ListItem>
        <View style={styles.bottomLine} />
      </TouchableOpacity>
    );
  };

  const searchLabs = (searchValue: string) => {
    var prikposten = data?.prikpost.prikposten;
    if (prikposten) {
      if (searchValue === '') {
        setFilteredLabs(prikposten);
        return;
      }

      let filteredLabsArr = prikposten.filter(x =>
        x.naam.includes(searchValue),
      );
      setFilteredLabs(filteredLabsArr);
    }
  };

  if (isLoading || (isError && isFetching)) {
    return (
      <Loader
        containerStyle={styles.containerLoader}
        textColor={theme.colors.primary}
        indicatorColor={theme.colors.primary}
        text={t('prickPosts.loading')}
      />
    );
  }

  if (isError) {
    return <ErrorView goBack={() => {}} reload={refetch} error={error} />;
  }

  return (
    <View style={[{...styles.flex}, {paddingBottom: insets.bottom}]}>
      <View style={styles.flex}>
        <View style={styles.container}>
          <View style={styles.searchInput}>
            <TextInput
              placeholder={t('prickPosts.searchPrickPost')}
              onChangeText={value => searchLabs(value)}
              icon={faSearch}
              iconStyle={{color: primary}}
              mainColor={primary}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Typography
              variant="h4"
              color={primary}
              text={t('prickPosts.filters')}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.flatList}
          data={filteredLabs}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
        <FloatingActionButton
          onPress={() =>
            navigate('Map', {
              data: data?.prikpost.prikposten,
              type: 'laboratory',
            })
          }
          icon={faMapMarkedAlt}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 0.9,
  },
  containerLoader: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    flex: 0.1,
    paddingHorizontal: Theme.spacing.horizontalPadding,
  },
  ItemContainer: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: Theme.spacing.horizontalPadding,
  },
  textContainer: {
    flexDirection: 'row',
  },
  kmText: {
    textAlign: 'right',
    flex: 1,
  },
  labName: {
    marginBottom: 5,
  },
  bottomLine: {
    borderBottomColor: Theme.colors.lightGray,
    borderBottomWidth: 1,
    justifyContent: 'flex-end',
  },
  address: {
    marginVertical: 8,
  },
  flex: {
    flex: 1,
  },
  searchInput: {
    flex: 1,
    justifyContent: 'center',
  },
  filterButton: {
    justifyContent: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllLaboratoriesScreen;
