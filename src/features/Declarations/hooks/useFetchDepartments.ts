import {useQuery} from '@tanstack/react-query';

import {fetchDepartments} from '../services/declarations-service';

export interface GetDepartmentsResponse {
  data: {
    id: number;
    naam: string;
    kode: string;
  }[];
}

const useFetchDepartments = (apuId: number) =>
  useQuery({
    queryKey: ['departments'],
    queryFn: () => fetchDepartments({apuId}) as Promise<GetDepartmentsResponse>,
    select: data => data.data,
  });

export default useFetchDepartments;
