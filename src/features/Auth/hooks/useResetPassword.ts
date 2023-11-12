import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';

import {resetPassword} from '../services/auth-service';

const useResetPassword = () =>
  useMutation<ResetPasswordResponse, AxiosError<ResetPasswordResponse>, any>({
    mutationFn: ({apuId}: {apuId: number}) => resetPassword(apuId),
  });

export default useResetPassword;
