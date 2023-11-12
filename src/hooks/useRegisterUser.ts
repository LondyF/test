import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';

import {registerUser} from '../features/Auth/services/auth-service';

export interface LovDoctor {
  flag: number;
  lovId: number;
  id: number;
  naam: string;
  tabNaam: string;
  lndKde: string;
}

interface RegisterUser {
  lovs: Array<LovDoctor>;
  status: Status;
  apuuser: User;
  licentie: string;
}

export interface RegisterUserResponse {
  access: RegisterUser;
}

const useRegisterUser = () =>
  useMutation<RegisterUserResponse, AxiosError<RegisterUserResponse>, any>({
    mutationFn: ({
      ...values
    }: {
      firstName: string;
      name: string;
      email: string;
      phoneNumber: string;
      address: string;
      country: string;
      language: string;
      idNumber: string;
      sex: 'M' | 'F';
      doctorId: number;
      insuranceId: number;
      apuMdsId?: number;
    }) =>
      registerUser(
        values.firstName,
        values.name,
        values.email,
        values.phoneNumber,
        values.idNumber,
        values.address,
        values.sex,
        values.country,
        values.language,
        values.insuranceId,
        values.doctorId,
        values.apuMdsId,
      ),
  });

export default useRegisterUser;
