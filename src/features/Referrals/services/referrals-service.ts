import request from '@utils/request';

export const getAllDoctorReferrals = async (apuId: number, mdsId?: number) =>
  await request({
    url: '/app-rn1/vrw/all',
    method: 'POST',
    data: {
      apuId,
      mdsId,
    },
  });

export const getAllMachtigingen = async (apuId: number, mdsId?: number) =>
  await request({
    url: '/app-rn1/mch/all',
    method: 'POST',
    data: {
      apuId,
      mdsId,
    },
  });
