import {useQuery} from '@tanstack/react-query';
import {getAllLabRequests} from '../services/laboratory-service';
import {GetAllLabRequestsResponse} from '../types/laboratory';

const useFetchAllLabRequests = (
  apuId: User['apuId'],
  mdsId?: number,
  forceCacheRefresh: boolean = false,
) => {
  return useQuery<GetAllLabRequestsResponse, {}>(
    ['labRequests', apuId, mdsId],
    () => getAllLabRequests(apuId, mdsId, forceCacheRefresh),
  );
};
export default useFetchAllLabRequests;
