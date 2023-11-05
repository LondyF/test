import request from '@src/utils/request';
import {DeclarationPhoto} from '../screens/NewDeclaration.screen';

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
    url: '/app-rn1/catalog/all',
    method: 'POST',
    data: {
      apuId,
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
