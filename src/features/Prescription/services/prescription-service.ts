import request from '@src/utils/request';

export const getAllPrescriptions = async (apuId: number, mdsId?: number) => {
  return await request({
    url: '/app-rn1/recepten',
    method: 'POST',
    data: {
      apuId,
      mdsId,
    },
  });
};
