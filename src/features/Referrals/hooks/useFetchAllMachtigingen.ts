import {useQuery} from '@tanstack/react-query';
import {getAllMachtigingen} from '../services/referrals-service';
import {GetAllMachtigingenResponse} from '../types/referrals';

const useFetchAllMachtigingen = (apuId: number, mdsId?: number) =>
  useQuery<GetAllMachtigingenResponse, {}>({
    queryKey: ['machtigingen', apuId, mdsId],
    queryFn: () => getAllMachtigingen(apuId, mdsId),
  });

export default useFetchAllMachtigingen;
