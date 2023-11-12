import {useQuery} from '@tanstack/react-query';
import {getAllAppointments} from '../services/appointments-services';
import {GetAllAppointmentsResponse} from '../types/appointments';

const useFetchAllAppointments = (apuId: number, mdsId?: number) =>
  useQuery<GetAllAppointmentsResponse>({
    queryKey: ['appointments', apuId, mdsId],
    queryFn: () => getAllAppointments(apuId, mdsId),
  });

export default useFetchAllAppointments;
