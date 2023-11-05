import {useQuery} from '@tanstack/react-query';

import {getAllMandansas} from '../services/mandansa-service';
import {GetAllMandansasResponse} from '../types/mandansa';

const useFetchMandansas = (apuId: User['apuId']) => {
  return useQuery<GetAllMandansasResponse, {}>(['mandansa', apuId], () =>
    getAllMandansas(apuId),
  );
};

export default useFetchMandansas;
