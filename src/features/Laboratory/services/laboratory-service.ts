import axios from 'axios';
import request from '@utils/request';
import {HomeAppointment} from '../hooks/useBookHomeAppointment';

export const getAllLaboratories = async (apuId: number = 2434) =>
  await request({
    url: '/app-rn1/prikposten',
    method: 'POST',
    data: {
      apuId,
    },
  });

export const getAllLabResults = async (
  apuId: number,
  forceCacheRefresh: boolean,
  mdsId?: number,
) => {
  return await request({
    url: '/app-rn1/lab/uitslagen',
    method: 'POST',
    data: {
      apuId,
      mdsId,
      forceCacheRefresh: +forceCacheRefresh,
    },
  });
};

export const getAllLabRequests = async (
  apuId: number,
  mdsId?: number,
  forceCacheRefresh: boolean = false,
) =>
  await request({
    url: '/app-rn1/lab/aanvragen',
    method: 'POST',
    data: {
      apuId,
      mdsId,
      forceCacheRefresh: +forceCacheRefresh,
    },
  });

export const getLabResult = async (resultUrl: string) => {
  const response = await axios(resultUrl);
  return await response.data;
};

export const getLabHomeAppointment = async (
  apuId: number,
  avaId: number,
  mdsId?: number,
) => {
  const response = await request({
    url: '/app-rn1/lab/prikthuis',
    method: 'POST',
    data: {
      apuId,
      avaId,
      mdsId,
    },
  });

  console.log(response.data);

  return response.data;
};

export const bookHomeAppointment = async (fields: HomeAppointment) => {
  const {avaId, apuId, email, mdsId, address, phoneNumber, name, labId} =
    fields;
  const response = await request({
    url: '/app-rn1/lab/prikthuis',
    method: 'POST',
    data: {
      apuId,
      avaId,
      mdsId,
      email,
      address,
      phoneNumber,
      name,
      labId,
      soort: 'SAVE',
    },
  });

  return response.data;
};
