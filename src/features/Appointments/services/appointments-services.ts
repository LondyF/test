import request from '@utils/request';
import { NewAppointment } from '../hooks/useBookAppointment';
import { AppointmentStatus } from '../types/appointmentStatus';

export const getAllAppointments = async (apuId: number, mdsId?: number) => {
  const data = await request({
    url: '/app-rn1/vis/visites',
    method: 'POST',
    data: {
      apuId,
      mdsId,
    },
  });

  console.log(data);

  return {
    appointments: data.appointments.filter((x: any) => x.docter != null),
  };
};

export const changeAppointmentStatus = async (
  appointmentStatus: AppointmentStatus,
  appointmentId: number,
  vesId: number,
  reasonText: string = '',
) => {
  return await request({
    url: '/app-rn1/vis/feedback',
    method: 'POST',
    data: {
      status: appointmentStatus,
      id: appointmentId,
      vesId,
      txt: reasonText,
    },
  });
};

export const fetchAvailableSpots = async (
  apuId: number,
  vesId: number,
  mdwId: number,
) =>
  await request({
    url: '/app-rn1/vis/freeSpots2',
    data: {
      apuId,
      vesId,
      mdwId,
    },
    method: 'POST',
  });

export const fetchAvailableDoctorEstablishments = async (apuId: number) =>
  await request({
    url: '/app-rn1/vis/freeSpots1',
    data: {
      apuId,
    },
    method: 'POST',
  });

export const bookAppointment = async ({
  apuId,
  mdwId,
  reason,
  datum,
  timeId,
  vesId,
  dt,
}: NewAppointment) =>
  await request({
    url: '/app-rn1/vis/freeSpots3',
    data: {
      apuId,
      mdwId,
      reason,
      dt,
      datum,
      timeId,
      vesId,
    },
    method: 'POST',
  });
