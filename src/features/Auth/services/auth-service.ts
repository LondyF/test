import request from '@utils/request';

export const loginUser = async (
  email: string,
  password: string,
  device: DeviceInfo,
  biometricPassword?: string,
) =>
  await request({
    url: '/auth-rn1/login',
    storeInCache: false,
    requiresAuth: false,
    method: 'POST',
    data: {
      device,
      username: email,
      pw1: password,
      pw2: biometricPassword,
    },
  });

export const validateLicense = async (
  license: string,
  lang: Language['abbreviation'],
  device: DeviceInfo,
) => {
  console.log('hiot');
  return await request({
    url: '/auth-rn1/checkLicense',
    storeInCache: false,
    requiresAuth: false,
    method: 'POST',
    data: {
      license,
      lang,
      device,
    },
  });
};

export const validatePhoneNumber = async (
  apuId: User['apuId'],
  license: string,
  smsCode: string,
  device: DeviceInfo,
) =>
  await request({
    url: '/auth-rn1/checkLicense',
    storeInCache: false,
    requiresAuth: false,
    method: 'POST',
    data: {
      apuId,
      license,
      smsKode: smsCode,
      device,
    },
  });

export const uploadPhotoOfId = async (
  apuId: User['apuId'],
  lang: Language['abbreviation'],
  image: string,
  rescanFotoId: boolean = false,
  refId: Number = 0,
) =>
  await request({
    url: '/app-rn1/foto2-id',
    method: 'POST',
    storeInCache: false,
    requiresAuth: true,
    data: {
      apuId,
      refId,
      base64: image,
      rescanFotoId: rescanFotoId ? 1 : 0,
      lovRefId: 66,
      lang,
    },
  });

export const registerUser = async (
  firstName: string,
  name: string,
  email: string,
  phoneNumber: string,
  idNumber: string,
  address: string,
  sex: 'M' | 'F',
  country: Country['abbreviation'],
  language: Language['abbreviation'],
  insuranceId: number,
  doctorId: number,
  apuMdsId: number | undefined = undefined,
) => {
  return await request({
    url: '/auth-rn1/saveAppUser',
    method: 'POST',
    storeInCache: false,
    requiresAuth: !!apuMdsId,
    data: {
      roepNaam: firstName,
      naam: name,
      telefoonNummer: phoneNumber,
      idNummer: idNumber,
      adres: address,
      lndKode: country,
      verzekeringsId: insuranceId,
      doctorId,
      language,
      sex,
      email,
      apuMdsId,
    },
  });
};

export const checkSedula = async (sedula: string, lang: string) =>
  await request({
    url: '/auth-rn1/checkSedula',
    method: 'POST',
    storeInCache: false,
    requiresAuth: false,
    data: {
      sedula,
      taal: lang,
    },
  });

export const resetPassword = async (apuId: number) =>
  await request({
    url: '/auth-rn1/resetPwd2',
    method: 'POST',
    storeInCache: false,
    requiresAuth: true,
    data: {
      apuId,
    },
  });

export const changePassword = async (
  apuId: number,
  oldPassword: string,
  newPassword: string,
  newPasswordConfirm: string,
) =>
  await request({
    url: '/app-rn1/changepwd',
    method: 'POST',
    storeInCache: false,
    data: {
      apuId,
      oldpw: oldPassword,
      newpw1: newPassword,
      newpw2: newPasswordConfirm,
    },
  });
