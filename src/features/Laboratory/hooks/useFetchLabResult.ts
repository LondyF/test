import {useQuery} from '@tanstack/react-query';
import {getLabResult} from '../services/laboratory-service';
import {GetLabResultResponse} from '../types/laboratory';

const useFetchLabResult = (labResultURL: string) => {
  return useQuery<GetLabResultResponse, {}>(['labResult', labResultURL], () =>
    getLabResult(labResultURL),
  );
};
export default useFetchLabResult;
