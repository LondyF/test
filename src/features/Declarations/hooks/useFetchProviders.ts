import {useQuery} from '@tanstack/react-query';

import {fetchProviders} from '../services/declarations-service';

export interface GetProvidersResponse {
  data: {
    id: number;
    naam: string;
    kode: string;
    unico: number;
    vesId: number;
    vkcId: number;
  }[];
}

const useFetchProviders = (vkcId: number | undefined) =>
  useQuery({
    queryKey: ['providers', vkcId],
    queryFn: () =>
      fetchProviders({vkcId: vkcId!}) as Promise<GetProvidersResponse>,
    select: data => data.data,
    enabled: !!vkcId,
  });

export default useFetchProviders;
