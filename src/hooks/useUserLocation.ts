import {useCallback, useRef} from 'react';
import {Platform} from 'react-native';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import {getDistanceBetween2Positions} from '@src/utils/location';
import {useEffect} from 'react';

export const useUserLocation = () => {
  let currentPosition = useRef<GeoPosition>();

  const requestLocationPermission = useCallback(async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const permissionResult = await check(permission);

    if (permissionResult === RESULTS.GRANTED) {
      return true;
    }

    if (permissionResult === RESULTS.DENIED) {
      return (await request(permission)) === RESULTS.GRANTED;
    }

    return false;
  }, []);

  useEffect(() => {
    (async () => {
      if (!(await requestLocationPermission())) {
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          currentPosition.current = position;
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    })();
  }, [requestLocationPermission]);

  const calculateDistanceFromUser = useCallback(
    (lat: number, lon: number, userLat?: number, userLng?: number) => {
      if (currentPosition.current) {
        return getDistanceBetween2Positions(
          userLat ?? currentPosition.current.coords.latitude,
          userLng ?? currentPosition.current.coords.longitude,
          lat,
          lon,
        ).toFixed(1);
      }
      return -1;
    },
    [],
  );

  const getUserLocation = useCallback(async () => {
    return new Promise<GeoPosition | {}>(resolve => {
      (async () => {
        if (!(await requestLocationPermission())) {
          resolve({});
          return;
        }

        Geolocation.getCurrentPosition(
          position => {
            resolve(position);
          },
          () => {
            resolve({});
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      })();
    });
  }, [requestLocationPermission]);

  return {
    calculateDistanceFromUser,
    userLocation: currentPosition.current,
    getUserLocation,
  };
};
