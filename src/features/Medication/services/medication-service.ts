import request from '@src/utils/request';

export const getMyMedications = async (apuId: number) => {
  const response = await request({
    url: '/app-rn1//medicijnlijst',
    method: 'POST',
    data: {
      apuId,
    },
  });
  return response;
};
