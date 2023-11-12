import {useQuery} from '@tanstack/react-query';
import {getAllLaboratories} from '../services/laboratory-service';
import {GetAllLaboratoriesResponse} from '../types/laboratory';

const useFetchLaboratories = (apuId: User['apuId']) => {
  return useQuery<GetAllLaboratoriesResponse, {}>({
    queryKey: ['laboratories', apuId],
    queryFn: () => getAllLaboratories(apuId),
  });
};
export default useFetchLaboratories;
