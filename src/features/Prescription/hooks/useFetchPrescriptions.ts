import {useQuery} from '@tanstack/react-query';
import {getAllPrescriptionsResponse} from '../prescription';
import {getAllPrescriptions} from '../services/prescription-service';

const useFetchPrescriptions = (apuId: User['apuId'], mdsId?: number) => {
  return useQuery<getAllPrescriptionsResponse, {}>({
    queryKey: ['prescriptions', apuId, mdsId],
    queryFn: () => getAllPrescriptions(apuId, mdsId),
  });
};
export default useFetchPrescriptions;
