import {useQuery} from '@tanstack/react-query';
import {AxiosError} from 'axios';

import {fetchAllDoctors} from '@services/lov-service';

export interface LovDoctor {
  flag: number;
  lovId: number;
  id: number;
  naam: string;
  tabNaam: string;
  lndKde: string;
}

interface FetchAllDoctors {
  lovs: Array<LovDoctor>;
  status: Status;
}

interface FetchAllDoctorsResponse {
  SQArtsen: FetchAllDoctors;
}

const useFetchAllDoctors = () =>
  useQuery<FetchAllDoctorsResponse, AxiosError<FetchAllDoctorsResponse>>({
    queryKey: ['doctors'],
    queryFn: () => fetchAllDoctors(),
  });

export default useFetchAllDoctors;
