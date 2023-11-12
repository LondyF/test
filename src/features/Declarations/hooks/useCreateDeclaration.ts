import {useMutation} from '@tanstack/react-query';
import {AxiosError} from 'axios';

import {createDeclaration} from '../services/declarations-service';

interface variables {
  apuId: number;
  declarationName: string;
}

const useCreateDeclaration = () =>
  useMutation<{}, AxiosError, variables>({
    mutationFn: ({...values}: variables) =>
      createDeclaration(values.apuId, values.declarationName),
  });

export default useCreateDeclaration;
