import {AppointmentStatus} from '../types/appointmentStatus';

const appointmentStatuses = {
  [AppointmentStatus.ACCEPTED]: {
    background: '#CFFCD9',
    fontColor: 'green',
    statusText: 'Door jouw geaccepteerd',
  },
  [AppointmentStatus.PENDING]: {
    background: '#FDECD2',
    fontColor: '#F79500',
    statusText: 'Wachtend op actie',
  },
  [AppointmentStatus.DECLINED]: {
    background: '#FfE5EC',
    fontColor: 'red',
    statusText: 'Door jou afgewezen',
  },
  [AppointmentStatus.CANCELD]: {
    background: '#E2DEDA',
    fontColor: '#8B8B8B',
    statusText: 'Door arts geannuleerd',
  },
  [AppointmentStatus.MOVED]: {
    background: '#D2F0FD',
    fontColor: '#00A0E5',
    statusText: 'Door arts verschoven',
  },
};

const useAppointmentStatus = (status: AppointmentStatus) => {
  return {...appointmentStatuses[status]};
};

export default useAppointmentStatus;
