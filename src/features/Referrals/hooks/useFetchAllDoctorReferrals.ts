import {useQuery} from '@tanstack/react-query';
import {getAllDoctorReferrals} from '../services/referrals-service';
import {GetAllReferralsResponse} from '../types/referrals';

const useFetchAllDoctorReferrals = (apuId: number, mdsId?: number) =>
  useQuery<GetAllReferralsResponse, {}>({
    queryKey: ['doctorReferrals', apuId, mdsId],
    queryFn: () => getAllDoctorReferrals(apuId, mdsId),
  });

export default useFetchAllDoctorReferrals;
