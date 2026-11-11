import {useQuery} from '@tanstack/react-query';
import {AxiosError} from 'axios';

import {fetchAllInsurers} from '@services/lov-service';

export interface LovInsurer {
  id: number;
  keoId: number;
  naam: string;
  naamShort: string;
  useSedula: number;
  useSQSedula: number;
  useSvb001: number;
}

export interface FetchAllInsurersResponse {
  Verzekeraars: Array<LovInsurer>;
}

const useFetchAllInsurers = () =>
  useQuery<FetchAllInsurersResponse, AxiosError<FetchAllInsurersResponse>>({
    queryKey: ['insurers'],
    queryFn: () => fetchAllInsurers(),
  });

export default useFetchAllInsurers;
