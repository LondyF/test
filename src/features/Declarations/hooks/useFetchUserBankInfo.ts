import {useQuery} from '@tanstack/react-query';

import {fetchUserBankInfo} from '../services/declarations-service';
import {GetUserBankInfoResponseInfo} from '../types/declarations';

const useFetchUserBankInfo = (apuId: number) => {
  return useQuery<GetUserBankInfoResponseInfo>({
    queryKey: ['bankInfo'],
    queryFn: () => fetchUserBankInfo(apuId),
  });
};

export default useFetchUserBankInfo;
