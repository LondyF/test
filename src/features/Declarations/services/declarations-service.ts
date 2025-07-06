import request from '@src/utils/request';
import {DeclarationPhoto} from '../screens/NewDeclaration.screen';
import {DeclarationLine} from '../types/declarations';

export const fetchUserBankInfo = (apuId: number) =>
  request({
    url: '/app-rn1/ftm/bankinfo',
    method: 'POST',
    data: {
      apuId,
    },
  });

export const saveUserBankInfo = async (
  apuId: number,
  rekeningNummer: string,
  bankId: number,
  tnv: string,
) => {
  return await request({
    url: '/app-rn1/ftm/bankinfosave',
    method: 'POST',
    data: {
      apuId,
      rekeningNummer,
      bankId,
      tnv,
    },
  });
};

export const fetchAllDeclaration = async (apuId: number) =>
  await request({
    url: '/app-declaration1/session',
    method: 'POST',
    data: {
      apuId,
      fase: 'GET',
    },
  });

export const createDeclaration = async (
  apuId: number,
  declarationName: string,
) =>
  await request({
    url: '/app-rn1/catalog',
    method: 'POST',
    data: {
      apuId,
      naam: declarationName,
    },
  });

export const saveDeclaration = async (
  apuId: number,
  catalogName: string,
  declarationPhotos: Array<DeclarationPhoto>,
) => {
  var photos = declarationPhotos.map(x => {
    return {
      imageBase64: x.image.base64,
      amount: x.amount,
      scanTypeId: x.selectedScanTypeId,
    };
  });
  const response = await request({
    url: '/app-rn1/catalog/save',
    method: 'POST',
    data: {
      apuId,
      catalogName,
      declarationPhotos: photos,
    },
  });
  return response;
};

export const createDeclarationSession = async ({
  apuId,
  vkcId,
  sqArtId,
  bedrag,
  datum,
  lndKde,
  currency,
  imageBase64 = '',
}: {
  apuId: number;
  vkcId: number;
  sqArtId: number;
  bedrag: number;
  datum: string;
  lndKde: string;
  currency: string;
  imageBase64?: string;
}) => {
  return await request({
    url: '/app-declaration1/session',
    method: 'POST',
    data: {
      fase: 'SAVE',
      apuId,
      sesId: '',
      vkcId,
      sqArtId,
      bedrag,
      datum,
      currency,
      lndKde,
      fotoB64: imageBase64,
    },
  });
};

export const fetchDepartments = async ({apuId}: {apuId: number}) =>
  await request({
    url: '/app-lov/vakgroepen',
    method: 'POST',
    data: {
      apuId,
    },
  });

export const fetchProviders = async ({vkcId}: {vkcId: number}) =>
  await request({
    url: '/app-lov/zorgverleners',
    method: 'POST',
    data: {
      vkcId,
    },
  });

export const fetchProcedure = async ({
  sqArtId,
  vkcId,
  apuId,
}: {
  sqArtId: number;
  vkcId: number;
  apuId: number;
}) =>
  await request({
    url: '/app-lov/verrichtingen',
    method: 'POST',
    data: {
      apuId,
      sqArtId,
      vkcId,
    },
  });

export const fetchDeclarationSession = async ({
  sesId,
  apuId,
}: {
  sesId: string;
  apuId: number;
}) => {
  return await request({
    url: '/app-declaration1/session',
    method: 'POST',
    data: {
      fase: 'GET',
      sesId,
      apuId,
    },
  });
};

export const submitDeclaration = async ({
  sesId,
  apuId,
  lines: regels,
}: {
  sesId: string;
  apuId: number;
  lines: DeclarationLine[];
}) => {
  return await request({
    url: '/app-declaration1/session',
    method: 'POST',
    data: {
      fase: 'SUBMIT',
      sesId,
      apuId,
      regels,
    },
  });
};

export const saveDeclarationPhoto = async ({
  sesId,
  apuId,
  imageBase64,
}: {
  sesId: string;
  apuId: number;
  imageBase64: string;
}) => {
  return await request({
    url: '/app-declaration1/session',
    method: 'POST',
    data: {
      fase: 'SAVEPDF',
      sesId,
      apuId,
      fotoB64: imageBase64,
    },
  });
};

export const deleteDeclaration = async ({
  sesId,
  apuId,
}: {
  sesId: string;
  apuId: number;
}) => {
  return await request({
    url: '/app-declaration1/session',
    method: 'POST',
    data: {
      fase: 'DELETE',
      sesId,
      apuId,
    },
  });
};
