import {useQuery} from '@tanstack/react-query';
import {fetchAvailableSpots} from '../services/appointments-services';
import {GetAvailableSpotsResponse} from '../types/spots';

const useFetchAvailableSpots = (
  apuId: number,
  vesId: number,
  mdwId: number,
) => {
  return useQuery<GetAvailableSpotsResponse>(
    'freeSpots',
    () => fetchAvailableSpots(apuId, vesId, mdwId),
    {
      enabled: false,
    },
  );
};

export default useFetchAvailableSpots;
