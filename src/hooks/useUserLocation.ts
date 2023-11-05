import {useCallback, useRef} from 'react';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

import {getDistanceBetween2Positions} from '@src/utils/location';
import {useEffect} from 'react';

export const useUserLocation = () => {
  let currentPosition = useRef<GeoPosition>();
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        currentPosition.current = position;
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

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
      Geolocation.getCurrentPosition(
        position => {
          resolve(position);
        },
        () => {
          resolve({});
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  }, []);

  return {
    calculateDistanceFromUser,
    userLocation: currentPosition.current,
    getUserLocation,
  };
};
