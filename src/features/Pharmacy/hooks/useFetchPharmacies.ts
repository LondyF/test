import {useQuery} from '@tanstack/react-query';
import {getAllPharmacies} from '../services/pharmacy-service';
import {GetAllPharmaciesResponse} from '../types/pharmacy';

const useFetchPharmacies = (apuId: User['apuId']) => {
  return useQuery<GetAllPharmaciesResponse, {}>(['pharmacies', apuId], () =>
    getAllPharmacies(apuId),
  );
};
export default useFetchPharmacies;
