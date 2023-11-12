import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {TransactionResultResponse} from '../identify';
import {GetTransactionResult} from '../services/identify-service';

const useGetTransactionResult = () =>
  useMutation<TransactionResultResponse, AxiosError, number>({
    mutationFn: trnId => GetTransactionResult(trnId),
  });

export default useGetTransactionResult;
