import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';

import {bookAppointment} from '../services/appointments-services';
import {BookAppointmentResponse} from '../types/spots';

export interface NewAppointment {
  datum: string;
  mdwId: number;
  timeId: number;
  dt: Date;
  vesId: number;
  apuId: number;
  reason: string;
}

const useBookAppointment = () =>
  useMutation<
    BookAppointmentResponse,
    AxiosError<BookAppointmentResponse>,
    NewAppointment
  >({
    mutationFn: (appointment: NewAppointment) => bookAppointment(appointment),
  });

export default useBookAppointment;
