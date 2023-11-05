import {useQuery} from '@tanstack/react-query';
import {AxiosError} from 'axios';

import {fetchAllInsurers} from '@services/lov-service';

export interface LovInsurer {
  lovId: number;
  id: number;
  naam: string;
  tabNaam: string;
}

interface FetchAllInsurers {
  lovs: Array<LovInsurer>;
  status: Status;
}

interface FetchAllInsurersResponse {
  verzekeringen: FetchAllInsurers;
}

const useFetchAllInsurers = () =>
  useQuery<FetchAllInsurersResponse, AxiosError<FetchAllInsurersResponse>>(
    'insurers',
    () => fetchAllInsurers(),
  );

export default useFetchAllInsurers;
