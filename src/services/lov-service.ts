import request from '@utils/request';

export const fetchAllDoctors = async () =>
  await request({
    url: '/auth-rn1/lov',
    method: 'POST',
    requiresAuth: false,
    data: {
      lovId: 88,
    },
  });

export const fetchAllInsurers = async () => {
  const response = await request({
    url: '/auth-rn1/lov',
    method: 'POST',
    requiresAuth: false,
    data: {
      lovId: 201,
    },
  });

  const returnObj = {
    verzekeringen: {
      ...response['noName-201'],
    },
  };

  return returnObj;
};

export const fetchAllBanks = async () =>
  await request({
    url: '/app-rn1/lov',
    method: 'POST',
    data: {
      lovId: 198,
    },
  });

export const fetchAllDeclarationScanTypes = async () =>
  await request({
    url: '/app-rn1/lov',
    method: 'POST',
    data: {
      lovId: 199,
    },
  });
