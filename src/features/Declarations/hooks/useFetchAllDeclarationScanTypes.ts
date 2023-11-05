import {AxiosError} from 'axios';
import {useQuery} from '@tanstack/react-query';

import {fetchAllDeclarationScanTypes} from '@src/services/lov-service';

export interface FetchAllScanTypesResponse {
  scanTypes: ScanTypes;
}

interface ScanTypesLov extends Lov {
  sortOrder: number;
}

export interface ScanTypes {
  status: Status;
  lovs: ScanTypesLov[];
}

const useFetchAllDeclarationScanTypes = () =>
  useQuery<FetchAllScanTypesResponse, AxiosError<FetchAllScanTypesResponse>>(
    'scanTypes',
    () => fetchAllDeclarationScanTypes(),
  );

export default useFetchAllDeclarationScanTypes;
