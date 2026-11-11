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

export const fetchAllInsurers = async () =>
  await request({
    url: '/auth-rn1/lov',
    method: 'POST',
    requiresAuth: false,
    data: {
      lovId: 207,
    },
  });

export const fetchPhoneCountries = async () =>
  await request({
    url: '/auth-rn1/lov',
    method: 'POST',
    requiresAuth: false,
    // The request cache keys on url + apuId, so caching would overwrite the insurers LOV.
    storeInCache: false,
    data: {
      lovId: 208,
    },
  });

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

export const fetchCountries = async ({apuId}: {apuId: number}) =>
  await request({
    url: '/app-lov/landkodes',
    method: 'POST',
    data: {
      apuId,
    },
  });
