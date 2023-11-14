import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { validateLicense } from '../services/auth-service';

const useValidateLicense = () =>
  useMutation<
    ValidateLicenseResponse,
    AxiosError<ValidateLicenseResponse>,
    any
  >({
    mutationFn: ({
      license,
      device,
      lang,
    }: {
      license: string;
      device: DeviceInfo;
      lang: Language['abbreviation'];
    }) => validateLicense(license, lang, device),
  });

export default useValidateLicense;
