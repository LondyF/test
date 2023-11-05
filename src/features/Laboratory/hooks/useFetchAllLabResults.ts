import {useQuery} from '@tanstack/react-query';
import {getAllLabResults} from '../services/laboratory-service';
import {GetAllLabResultsResponse} from '../types/laboratory';

const useFetchAllLabResults = (
  apuId: User['apuId'],
  mdsId?: number,
  forceCacheRefresh: boolean = false,
) => {
  return useQuery<GetAllLabResultsResponse, {}>(['labResults', apuId], () =>
    getAllLabResults(apuId, forceCacheRefresh, mdsId),
  );
};

export default useFetchAllLabResults;
