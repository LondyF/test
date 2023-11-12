import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {fetchDirections} from '../services/map-service';
import {DirectionsResponse} from '../types/map';

interface values {
  apuId: number;
  originLat: number;
  originLon: number;
  desLat: number;
  desLon: number;
}

const useFetchDirections = () =>
  useMutation<DirectionsResponse, AxiosError, values>({
    mutationFn: ({...values}: values) => {
      return fetchDirections(
        values.apuId,
        values.originLat,
        values.desLat,
        values.originLon,
        values.desLon,
      );
    },
  });

export default useFetchDirections;
