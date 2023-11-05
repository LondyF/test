import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView, {Camera, LatLng, Marker, Polyline} from 'react-native-maps';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faDirections} from '@fortawesome/pro-regular-svg-icons';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {RouteProp} from '@react-navigation/core';
import {GeoPosition} from 'react-native-geolocation-service';
import {useTranslation} from 'react-i18next';

import {useUserLocation} from '@src/hooks/useUserLocation';
import {ListItem, Loader, Typography} from '@src/components';
import {Pharmacy} from '@src/features/Pharmacy/types/pharmacy';
import useAuthStore from '@src/stores/useAuthStore';
import {decodePolyline} from '@src/utils/utils';
import useTheme from '@src/hooks/useTheme';
import {Theme as ThemeTypes} from '@src/styles/styles';
import {Laboratory} from '@src/features/Laboratory/types/laboratory';
import useInternetConnection from '@src/hooks/useInternetConnection';
import {getDistanceBetween2Positions} from '@src/utils/location';

import useFetchDirections from '../hooks/useFetchDirections';
import {Step} from '../types/map';

interface Props {
  route: RouteProp<
    {
      params: {
        data: Pharmacy[] | Laboratory[];
        type: 'pharmacy' | 'laboratory';
      };
    },
    'params'
  >;
}

interface mapItem extends Pharmacy, Laboratory {
  distanceFromUser: string | number;
}

const MapScreen: React.FC<Props> = ({route}) => {
  const user = useAuthStore(state => state.user);
  let {getUserLocation} = useUserLocation();
  let {
    isLoading: isLoadingDirections,
    data: directionsResponse,
    mutateAsync: mutateDirectionsAsync,
  } = useFetchDirections();
  const dataItems = useMemo(() => route.params.data || [], [route.params.data]);
  const isSingleMapItem = dataItems.length === 1;

  let markersRefs: any = {};
  const mapRef = useRef<MapView>(null);

  const [markers, setMarkers] = useState<Array<any>>();
  const [polyline, setPolyline] = useState<Array<LatLng>>([]);
  const [isShowingDirections, setIsShowingDirections] =
    useState<boolean>(false);
  const [hasUserLocation, setHasUserLocation] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>();
  const [mapItems, setMapItems] = useState<Array<mapItem>>([]);

  const appTheme = useTheme();
  const {t} = useTranslation();
  const styles = makeStyles(appTheme);
  const {checkIfConnected} = useInternetConnection();

  useEffect(() => {
    async function initHasUserLocation() {
      try {
        const {
          coords: {latitude: userLat, longitude: userLong},
        } = (await getUserLocation()) as GeoPosition;
        setHasUserLocation(!!(userLat && userLong));
        setUserLocation(() => {
          return {lat: userLat, lng: userLong};
        });
      } catch {
        setHasUserLocation(false);
      }
    }
    initHasUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    let initialMapItems = dataItems
      .filter(x =>
        userLocation && !isSingleMapItem
          ? getDistanceBetween2Positions(
              userLocation.lat,
              userLocation.lng,
              x.lat,
              x.lng,
            ) <= 10
          : x,
      )
      .map(x => {
        var distance = userLocation
          ? getDistanceBetween2Positions(
              userLocation.lat,
              userLocation.lng,
              x.lat,
              x.lng,
            ).toFixed(1)
          : -1;
        return {
          ...x,
          distanceFromUser: distance,
        } as mapItem;
      });
    setMapItems(initialMapItems);
  }, [dataItems, userLocation, isSingleMapItem]);

  useEffect(() => {
    let initialMarkers =
      mapItems &&
      mapItems.map(item => {
        return {id: item.id, lat: item.lat, lng: item.lng, naam: item.naam};
      });
    setMarkers(initialMarkers);
  }, [mapItems]);

  const isUserLocationAvailable = () => {
    return !!(
      hasUserLocation &&
      userLocation &&
      userLocation.lat &&
      userLocation.lng
    );
  };

  const getDirections = async (item: Pharmacy | Laboratory) => {
    checkIfConnected(async () => {
      if (!isUserLocationAvailable()) {
        Alert.alert('error', t('map.noUserLocation'));
        return;
      }
      pressedOnItem(item);
      setIsShowingDirections(true);
      if (isUserLocationAvailable()) {
        var res = await mutateDirectionsAsync({
          apuId: user?.apuId || -1,
          desLat: item.lat,
          desLon: item.lng,
          originLat: userLocation!.lat,
          originLon: userLocation!.lng,
        });

        if (res.status === 'OK' && res.routes.length > 0) {
          setPolyline(decodePolyline(res.routes[0].overview_polyline.points));
        } else {
          Alert.alert('Error', t('map.errorLoadingDirections'));
        }
      }
    });
  };

  const testa = () => {
    if (
      directionsResponse?.status === 'OK' &&
      directionsResponse?.routes.length > 0
    ) {
      return directionsResponse?.routes[0].legs[0].steps;
    } else {
      setIsShowingDirections(false);
    }
  };

  const keyExtractor = (_: Step | Pharmacy | Laboratory, index: number) =>
    `${index}`;

  const renderDirectionStep = ({index, item}: {index: number; item: Step}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          pressedOnDirectionStep(
            item.start_location.lat,
            item.start_location.lng,
          )
        }>
        <ListItem style={styles.listItem} index={index}>
          <View style={styles.listItemLeftColumn}>
            <Typography
              variant="h4"
              fontWeight="500"
              color={appTheme.colors.darkGray}
              text={item.html_instructions.replace(/<[^>]*>?/gm, '')}
            />
          </View>
          <View style={styles.listItemRightColumn}>
            <Typography
              fontWeight="500"
              color={appTheme.colors.darkGray}
              variant="h4"
              text={item.distance.text}
            />
          </View>
        </ListItem>
      </TouchableOpacity>
    );
  };

  const pressedOnDirectionStep = (lat: number, lng: number) => {
    animateToCoord(lat, lng, 16);
  };

  const animateToCoord = (
    latitude: number,
    longitude: number,
    zoom: number,
  ) => {
    let camera: Camera = {
      center: {
        latitude,
        longitude,
      },
      heading: 0,
      pitch: 0,
      zoom,
      altitude: 0,
    };
    mapRef.current?.animateCamera(camera);
  };

  const renderItem = ({index, item}: {index: number; item: mapItem}) => {
    return (
      <TouchableOpacity onPress={() => pressedOnItem(item)}>
        <ListItem index={index}>
          <Typography
            variant="h6"
            color={appTheme.colors.darkGray}
            textStyle={styles.itemGroupTextStyle}
            fontWeight="500"
            text={item.grpNaam2 || ''}
          />
          <View style={styles.listItem}>
            <View style={styles.listItemLeftColumn}>
              <Typography
                variant="h4"
                color={appTheme.colors.darkGray}
                fontWeight="500"
                text={item.naam}
                textStyle={styles.itemNaamTextStyle}
              />
              <Typography
                variant="h5"
                fontWeight="500"
                color="#B8B8B8"
                text={item.openClose}
              />
            </View>
            <View style={styles.listItemRightColumn}>
              <Typography
                color={appTheme.colors.darkGray}
                textStyle={{marginBottom: 10 / 2}}
                variant="h4"
                fontWeight="500"
                text={
                  item.distanceFromUser === -1
                    ? 'N/A'
                    : item.distanceFromUser + 'km'
                }
              />
              <TouchableOpacity onPress={() => getDirections(item)}>
                <FontAwesomeIcon size={24} icon={faDirections} />
              </TouchableOpacity>
            </View>
          </View>
        </ListItem>
      </TouchableOpacity>
    );
  };

  const pressedOnItem = (item: Pharmacy | Laboratory) => {
    setPolyline([]);
    setMarkers([{id: item.id, lat: item.lat, lng: item.lng, naam: item.naam}]);
    markersRefs[item.id].showCallout();
    if (!item.lat || !item.lng) {
      Alert.alert(
        'Error',
        t('map.errorLoadingLocation', {itemNaam: item.naam}),
      );
      return;
    }
    let coords: Array<LatLng> = [{latitude: item.lat, longitude: item.lng}];
    if (isUserLocationAvailable()) {
      coords.push({latitude: userLocation!.lat, longitude: userLocation!.lng});
      mapRef.current?.fitToCoordinates(coords, {
        animated: true,
        edgePadding: {top: 180, left: 120, right: 120, bottom: 30},
      });
    } else {
      animateToCoord(item.lat, item.lng, 12);
    }
  };

  const setMarkerRef = (marker: Marker | null, botika: Pharmacy) => {
    if (marker) {
      markersRefs[botika.id] = marker;
    }
  };

  const onMapReady = () => {
    if (isSingleMapItem) {
      pressedOnItem(mapItems[0]);
    }
  };

  return (
    <View style={styles.pageContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onMapReady={() => onMapReady()}
        showsUserLocation={true}
        provider="google"
        initialRegion={{
          latitude: isUserLocationAvailable() ? userLocation!.lat : 12.114451,
          longitude: isUserLocationAvailable() ? userLocation!.lng : -68.91818,
          latitudeDelta: 0.0043,
          longitudeDelta: 0.034,
        }}>
        {mapItems.length > 0 &&
          mapItems.map(item => {
            return (
              <Marker
                style={
                  markers?.find(x => x.id === item.id)
                    ? styles.showMarkers
                    : styles.dontShowMarkers
                }
                key={item.id}
                tracksViewChanges={false}
                ref={ref => setMarkerRef(ref, item)}
                title={item.naam}
                description={item.adres}
                coordinate={{
                  latitude: item.lat || -1,
                  longitude: item.lng || -1,
                }}
              />
            );
          })}
        {polyline.length > 0 && (
          <Polyline
            strokeColor={appTheme.colors.primary}
            strokeWidth={4}
            coordinates={polyline}
          />
        )}
      </MapView>
      <View style={styles.footer}>
        {!isSingleMapItem && (
          <View style={styles.footerHeader}>
            <View style={styles.footerHeaderTitleContainer}>
              <TouchableOpacity onPress={() => setIsShowingDirections(false)}>
                {isShowingDirections && (
                  <FontAwesomeIcon
                    style={styles.backButtonIcon}
                    icon={faChevronLeft}
                  />
                )}
              </TouchableOpacity>
              <Typography
                variant="h4"
                fontWeight="bold"
                text={
                  route.params.type === 'pharmacy'
                    ? t('map.pharmaciesCloseBy')
                    : t('map.labsCloseBy')
                }
              />
            </View>
            <Typography
              variant="h4"
              fontWeight="bold"
              text={`${t('map.radius')}: 10km`}
            />
          </View>
        )}
        {!isShowingDirections ? (
          !isSingleMapItem ? (
            <FlatList
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              data={mapItems}
            />
          ) : (
            <View style={styles.singleMapItemContainer}>
              <TouchableOpacity onPress={() => getDirections(mapItems[0])}>
                <FontAwesomeIcon
                  style={styles.singleMapItemIcon}
                  size={24}
                  icon={faDirections}
                />
              </TouchableOpacity>
              <View style={styles.singleMapItemTextContainer}>
                <Typography
                  textStyle={styles.singleMapItemText}
                  variant="b1"
                  fontWeight="bold"
                  color={appTheme.colors.darkGray}
                  text={t('map.getDirections')}
                />
              </View>
            </View>
          )
        ) : (
          <View style={styles.flex}>
            {isLoadingDirections ? (
              <Loader
                text={t('map.loadingDirections')}
                textColor={appTheme.colors.primary}
                indicatorColor={appTheme.colors.primary}
              />
            ) : (
              <FlatList
                contentContainerStyle={styles.directionStepsContainerContent}
                keyExtractor={keyExtractor}
                renderItem={renderDirectionStep}
                data={testa()}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const makeStyles = (theme: ThemeTypes) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    directionStepsContainerContent: {
      flexGrow: 1,
    },
    dontShowMarkers: {
      opacity: 0,
    },
    showMarkers: {
      opacity: 1,
    },
    pageContainer: {
      flex: 1,
    },
    footer: {
      flex: 0.45,
      backgroundColor: 'white',
    },
    footerHeader: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.horizontalPadding,
      paddingVertical: 20,
      justifyContent: 'space-between',
    },
    footerHeaderTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    map: {
      flex: 0.55,
    },
    listItem: {
      paddingVertical: 15,
      paddingHorizontal: theme.spacing.horizontalPadding,
      flexDirection: 'row',
      flex: 1,
    },
    listItemHeader: {
      marginBottom: 10,
      justifyContent: 'space-between',
    },
    listItemRightColumn: {
      flex: 0.2,
      alignItems: 'flex-end',
    },
    listItemLeftColumn: {
      flex: 0.8,
      justifyContent: 'center',
    },
    singleMapItemContainer: {
      paddingHorizontal: theme.spacing.horizontalPadding,
      paddingVertical: theme.spacing.verticalPadding,
      flex: 1,
    },
    singleMapItemTextContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 30,
    },
    singleMapItemText: {
      textAlign: 'center',
    },
    singleMapItemIcon: {
      alignSelf: 'flex-end',
    },
    backButtonIcon: {
      marginRight: 10,
    },
    itemNaamTextStyle: {
      marginBottom: 10,
    },
    itemGroupTextStyle: {
      paddingHorizontal: theme.spacing.horizontalPadding,
      paddingTop: 10,
    },
  });

export default MapScreen;
