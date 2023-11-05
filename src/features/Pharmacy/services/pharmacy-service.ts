import request from '@utils/request';

export const getAllPharmacies = async (apuId: number = 2434) => {
  try {
    const response = await request({
      url: '/app-rn1/botikas',
      method: 'POST',
      data: {
        apuId,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
