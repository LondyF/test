import {useQuery} from '@tanstack/react-query';
import {AxiosError} from 'axios';

import {fetchAllBanks} from '@src/services/lov-service';

export interface FetchAllBanksResponse {
  banken: Banks;
}

interface BanksLov extends Lov {
  sortOrder: number;
}

export interface Banks {
  status: Status;
  lovs: BanksLov[];
}

const useFetchAllBanks = () =>
  useQuery<FetchAllBanksResponse, AxiosError<FetchAllBanksResponse>>({
    queryKey: ['banks'],
    queryFn: () => fetchAllBanks(),
  });

export default useFetchAllBanks;
