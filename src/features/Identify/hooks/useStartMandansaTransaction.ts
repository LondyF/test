import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {PollAppResponse} from '../identify';
import {StartMandansaTransaction} from '../services/identify-service';

type values = {
  uuId: number;
  apuId: number;
  recId: number;
};

const useStartMandansaTransaction = () =>
  useMutation<PollAppResponse, AxiosError, values>({
    mutationFn: ({uuId, apuId, recId}: values) =>
      StartMandansaTransaction(uuId, apuId, recId),
  });

export default useStartMandansaTransaction;
