import request from '@utils/request';

export const getAllMandansas = async (apuId: number) =>
  await request({
    url: '/app-rn1/mandansa/me',
    method: 'POST',
    data: {
      apuId,
    },
  });

export const scanMandansaQRCode = async (
  apuId: number,
  uuId: number,
  recId: number,
  apuMdsId: number,
) =>
  await request({
    url: '/app-rn1/mandansa/tikkiescan',
    method: 'POST',
    storeInCache: false,
    data: {
      apuId,
      uuId,
      recId,
      apuMdsId,
    },
  });

export const changeMandansaStatus = async (mdsId: number, status: number) =>
  await request({
    url: '/app-rn1/mandansa/status',
    method: 'POST',
    storeInCache: false,
    data: {
      mdsId,
      status,
    },
  });
