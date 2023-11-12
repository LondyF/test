import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {PollAppResponse} from '../identify';
import {StartPullTransactie} from '../services/identify-service';

type values = {
  uuId: number;
  apuId: number;
};

const useStartPullTransactie = () =>
  useMutation<PollAppResponse, AxiosError, values>({
    mutationFn: ({...values}: values) =>
      StartPullTransactie(values.uuId, values.apuId),
  });

export default useStartPullTransactie;
