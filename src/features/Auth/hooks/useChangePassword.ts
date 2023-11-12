import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {changePassword} from '../services/auth-service';

interface Status {
  status: number;
  msgid: number;
  msg: string;
  msg2?: any;
}

interface Access {
  status: Status;
}

interface RootObject {
  access: Access;
}

const useChangePassword = () =>
  useMutation<any, AxiosError<RootObject>, any>({
    mutationFn: ({
      ...values
    }: {
      apuId: number;
      oldPassword: string;
      newPassword: string;
      newPasswordConfirm: string;
    }) =>
      changePassword(
        values.apuId,
        values.oldPassword,
        values.newPassword,
        values.newPasswordConfirm,
      ),
  });

export default useChangePassword;
