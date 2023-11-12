import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';

import {saveUserBankInfo} from '../services/declarations-service';
import {SaveBankInfoResponse} from '../types/declarations';

interface variables {
  apuId: number;
  accountNumber: string;
  inNameOf: string;
  bankId: number;
}

const useSaveUserBankInfo = () =>
  useMutation<SaveBankInfoResponse, AxiosError, variables>({
    mutationFn: ({...values}: variables) =>
      saveUserBankInfo(
        values.apuId,
        values.accountNumber,
        values.bankId,
        values.inNameOf,
      ),
  });

export default useSaveUserBankInfo;
