import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {authUserWithQR} from '../services/userProfile-service';
import {AuthUserWthQRResponse} from '../types/userProfile';

const useAuthUserWithQR = () =>
  useMutation<
    AuthUserWthQRResponse,
    AxiosError<AuthUserWthQRResponse>,
    {apuId: number; qr: string}
  >(({apuId, qr}) => authUserWithQR(apuId, qr));

export default useAuthUserWithQR;
