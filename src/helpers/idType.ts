import {LovInsurer} from '@hooks/useFetchAllInsurers';

export type IdType = 'SEDULA' | 'SQSEDULA';

const ID_TYPE_TRANSLATION_KEYS = {
  SEDULA: {
    registerLabel: 'register.idNumber',
    required: 'register.idRequired',
    length: 'register.idLength',
    existOfNumbers: 'register.idExistOfNumbers',
    profileLabel: 'profile.idNumber',
    identifyLabel: 'identify.sedula',
    digitalSignatureLabel: 'digitalSignature.idNumber',
  },
  SQSEDULA: {
    registerLabel: 'register.sqSedulaNumber',
    required: 'register.sqSedulaRequired',
    length: 'register.sqSedulaLength',
    existOfNumbers: 'register.sqSedulaExistOfNumbers',
    profileLabel: 'profile.sqSedulaNumber',
    identifyLabel: 'identify.sqSedula',
    digitalSignatureLabel: 'identify.sqSedula',
  },
} as const;

export const getInsurerIdType = (insurer?: LovInsurer): IdType =>
  insurer?.useSQSedula === 1 ? 'SQSEDULA' : 'SEDULA';

export const getIdTypeTranslationKeys = (idType?: IdType | null) =>
  ID_TYPE_TRANSLATION_KEYS[idType === 'SQSEDULA' ? 'SQSEDULA' : 'SEDULA'];
