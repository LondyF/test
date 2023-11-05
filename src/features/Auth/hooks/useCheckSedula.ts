import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {checkSedula} from '../services/auth-service';

const useCheckSedula = () =>
  useMutation<CheckSedulaResponse, AxiosError<ValidateLicenseResponse>, any>(
    ({sedula, lang}: {sedula: string; lang: Language['abbreviation']}) =>
      checkSedula(sedula, lang),
  );

export default useCheckSedula;
