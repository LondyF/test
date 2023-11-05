import request from '@src/utils/request';

export const fetchBotikaNaWarda = (apuId: number) => {
  return request({
    url: '/app-rn1/botikanawarda',
    method: 'POST',
    data: {apuId},
  });
};
