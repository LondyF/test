import request from '@src/utils/request';

export const StartPullTransactie = async (uuId: number, apuId: number) =>
  await request({
    url: '/scan-rn1/pollapp',
    method: 'POST',
    storeInCache: false,
    data: {
      uuId,
      apuId,
    },
  });

export const StartMandansaTransaction = async (uuId: number, apuId: number, recId: number) =>
  await request({
    url: '/app-rn1/mandansa/tikkie',
    method: 'POST',
    storeInCache: false,
    data: {
      uuId,
      apuId,
      recId,
    },
  });

export const GetTransactionResult = async (trnId: number) =>
  await request({
    url: '/scan-rn1/trnresult',
    storeInCache: false,
    method: 'POST',
    data: {
      trnId,
    },
  });
