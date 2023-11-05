import {AxiosError} from 'axios';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {ToastTypes} from '@src/components/Toast/toastTypes';
import useToast from '@src/components/Toast/useToast';

import {changeAppointmentStatus} from '../services/appointments-services';
import {GetAllAppointmentsResponse} from '../types/appointments';
import {AppointmentStatus} from '../types/appointmentStatus';

export type values = {
  appointmentStatus: AppointmentStatus;
  appointmentId: number;
  vesId: number;
  reasonText: string;
};

const useChangeAppointmentStatus = (apuId: number) => {
  const queryClient = useQueryClient();
  const Toast = useToast();
  return useMutation<{}, AxiosError, values>(
    ({...values}: values) =>
      changeAppointmentStatus(
        values.appointmentStatus,
        values.appointmentId,
        values.vesId,
      ),
    {
      onMutate: async values => {
        await queryClient.cancelQueries('appointments');
        const snapshotOfPreviousAppointments =
          queryClient.getQueryData<GetAllAppointmentsResponse>([
            'appointments',
            apuId,
          ]);
        if (snapshotOfPreviousAppointments) {
          queryClient.setQueryData<GetAllAppointmentsResponse>(
            ['appointments', apuId],
            {
              ...snapshotOfPreviousAppointments!,
              appointments: [
                ...snapshotOfPreviousAppointments?.appointments.map(
                  appointment => {
                    if (appointment.id === values.appointmentId) {
                      return {
                        ...appointment,
                        status: values.appointmentStatus,
                      };
                    }
                    return appointment;
                  },
                ),
              ],
            },
          );
        }
        return {
          snapshotOfPreviousAppointments,
        };
      },
      onError() {
        queryClient.invalidateQueries(['appointments', apuId]);
        Toast('something went wrong', ToastTypes.ERROR);
      },
      onSuccess() {
        queryClient.invalidateQueries(['appointments', apuId]);
        Toast('Successfully updated appointment', ToastTypes.SUCCESS);
      },
    },
  );
};
export default useChangeAppointmentStatus;
