import {useMutation} from '@tanstack/react-query';

import {finishRegistration} from '../services/auth-service';

const useCheckSedula = () =>
  useMutation({
    mutationFn: (apuId: number) => finishRegistration(apuId),
  });

export default useCheckSedula;
