import {useQuery} from '@tanstack/react-query';
import {getAllAppointments} from '../services/appointments-services';
import {GetAllAppointmentsResponse} from '../types/appointments';

const useFetchAllAppointments = (apuId: number, mdsId?: number) =>
  useQuery<GetAllAppointmentsResponse>(['appointments', apuId, mdsId], () =>
    getAllAppointments(apuId, mdsId),
  );

export default useFetchAllAppointments;
