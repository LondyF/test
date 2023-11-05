import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

import {FlatList} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {faMapMarkedAlt, faSearch} from '@fortawesome/pro-solid-svg-icons';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {
  Typography,
  Loader,
  TextInput,
  FloatingActionButton,
} from '@src/components';
import {Theme} from '@src/styles';
import ListItem from '@src/components/listItem';
import {useUserLocation} from '@hooks/useUserLocation';
import useAuthStore from '@stores/useAuthStore';

import useFetchPharmacies from '../hooks/useFetchPharmacies';
import {Pharmacy} from '../types/pharmacy';

const AllPharmaciesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const apuId = useAuthStore(state => state.user?.apuId);

  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const {data, isLoading, status} = useFetchPharmacies(apuId!);
  const {calculateDistanceFromUser} = useUserLocation();
  const [filteredBotikas, setFilteredBotikas] = useState<Pharmacy[]>([]);

  useEffect(() => {
    if (data && status === 'success') {
      setFilteredBotikas(data.botika.botikas);
    }
  }, [data, status]);

  const {
    colors: {darkGray, primary},
  } = Theme;

  const keyExtractor = (_: Pharmacy, index: number) => `${index}`;

  const navigateToMap = (item: Pharmacy) => {
    navigate('Map', {data: [item]});
  };

  const renderItem = ({index, item}: {index: number; item: Pharmacy}) => {
    let km = calculateDistanceFromUser(item.lat, item.lng);
    return (
      <TouchableOpacity onPress={() => navigateToMap(item)}>
        <ListItem index={index} style={styles.ItemContainer}>
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

  const searchPharmacies = (searchValue: string) => {
    var botikas = data?.botika.botikas;
    if (botikas) {
      if (searchValue === '') {
        setFilteredBotikas(botikas);
        return;
      }

      let filteredBotikaArr = botikas.filter(x => x.naam.includes(searchValue));
      setFilteredBotikas(filteredBotikaArr);
    }
  };

  return (
    <View style={[{...styles.flex}, {paddingBottom: insets.bottom}]}>
      {!isLoading ? (
        <View style={styles.flex}>
          <View style={styles.container}>
            <View style={styles.searchInput}>
              <TextInput
                placeholder={t('pharmacies.searchPharmacy')}
                onChangeText={value => searchPharmacies(value)}
                icon={faSearch}
                iconStyle={{color: primary}}
                mainColor={primary}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Typography
                variant="h4"
                color={primary}
                text={t('pharmacies.filter')}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={styles.flatList}
            data={filteredBotikas}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
          <FloatingActionButton
            onPress={() =>
              navigate('Map', {data: data?.botika.botikas, type: 'pharmacy'})
            }
            icon={faMapMarkedAlt}
          />
        </View>
      ) : (
        <Loader
          textColor={primary}
          indicatorColor={primary}
          text={'Loading pharmacies...'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 0.9,
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

export default AllPharmaciesScreen;
