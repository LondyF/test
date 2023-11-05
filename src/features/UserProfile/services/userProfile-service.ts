import request from '@src/utils/request';

export const SaveUserProfile = async (user: User) =>
  await request({
    method: 'POST',
    url: '/app-rn1/appUser',
    storeInCache: false,
    data: {
      apuId: user.apuId,
      firstName: user.firstName,
      naam: user.naam,
      adres: user.adres,
      telefoonNummer: user.sms,
      eMail: user.email,
      taal: user.lang,
      sqArtId: user.sqArtId,
      aanvulVerzekering: user.vzk2Id,
    },
  });

export const uploadProfilePicture = async (apuId: User['apuId'], image: string) =>
  await request({
    url: '/app-rn1/foto-id',
    method: 'POST',
    storeInCache: false,
    requiresAuth: true,
    data: {
      refId: apuId,
      base64: image,
      lovRefId: 44,
    },
  });

export const authUserWithQR = async (apuId: number, qr: string) =>
  await request({
    url: '/app-rn1/2faktor',
    method: 'POST',
    storeInCache: false,
    data: {
      apuId,
      qr,
    },
  });
