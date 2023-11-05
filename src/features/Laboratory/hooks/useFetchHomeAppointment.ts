import {useQuery} from '@tanstack/react-query';
import {getLabHomeAppointment} from '../services/laboratory-service';
import {GetHomeAppointmentResponse} from '../types/laboratory';

const useFetchHomeAppointment = (
  apuId: number,
  avaId: number,
  mdsId?: number,
) => {
  return useQuery<GetHomeAppointmentResponse, {}>(['labHomeAppointment'], () =>
    getLabHomeAppointment(apuId, avaId, mdsId),
  );
};

export default useFetchHomeAppointment;
