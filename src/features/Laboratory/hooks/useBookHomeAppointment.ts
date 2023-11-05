import {useMutation} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {bookHomeAppointment} from '../services/laboratory-service';

export interface HomeAppointment {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  apuId: number;
  avaId: number;
  mdsId?: number;
  labId: number;
}

interface Response {
  status: Status;
}

const useBookHomeAppointment = () => {
  return useMutation<Response, AxiosError, HomeAppointment>(
    (appointment: HomeAppointment) => bookHomeAppointment(appointment),
  );
};

export default useBookHomeAppointment;
