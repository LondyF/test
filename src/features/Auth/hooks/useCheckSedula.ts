import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {checkSedula} from '../services/auth-service';

const useCheckSedula = () =>
  useMutation<CheckSedulaResponse, AxiosError<ValidateLicenseResponse>, any>({
    mutationFn: ({
      sedula,
      lang,
      insuranceId,
      idType,
    }: {
      sedula: string;
      lang: Language['abbreviation'];
      insuranceId?: number;
      idType?: User['idType'];
    }) => checkSedula(sedula, lang, insuranceId, idType),
  });

export default useCheckSedula;
