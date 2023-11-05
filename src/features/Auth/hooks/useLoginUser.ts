import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {loginUser} from '../services/auth-service';

interface Status {
  status: number;
  msgid: number;
  msg: string;
  msg2?: any;
  message: {
    alinea1: string;
    alinea2: string;
    buttonType: number;
    header: null;
    popUpType: number;
  };
}

interface Access {
  status: Status;
}

interface RootObject {
  access: Access;
}

const useLoginUser = () =>
  useMutation<any, AxiosError<RootObject>, any>(
    ({
      ...values
    }: {
      email: string;
      password: string;
      biometricPassword?: string;
      device: DeviceInfo;
    }) =>
      loginUser(
        values.email,
        values.password,
        values.device,
        values.biometricPassword,
      ),
  );

export default useLoginUser;
