import {fetchCountries} from '@src/services/lov-service';
import {useQuery} from '@tanstack/react-query';

export interface Country {
  id: number;
  iso: string;
  naam: string;
  valuta: string;
  freeTxt: number;
}

interface Response {
  data: Country[];
}

const useFetchCountries = (params: {apuId: number}) =>
  useQuery({
    queryKey: ['countries'],
    queryFn: () => fetchCountries(params) as Promise<Response>,
    select: data => data.data,
  });

export default useFetchCountries;
