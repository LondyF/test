import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {validatePhoneNumber} from '../services/auth-service';

const useValidatePhoneNumber = () =>
  useMutation<
    ValidateLicenseResponse,
    AxiosError<ValidateLicenseResponse>,
    any
  >({
    mutationFn: ({
      apuId,
      license,
      smsCode,
      device,
    }: {
      apuId: User['apuId'];
      license: string;
      smsCode: string;
      device: DeviceInfo;
    }) => validatePhoneNumber(apuId, license, smsCode, device),
  });

export default useValidatePhoneNumber;
