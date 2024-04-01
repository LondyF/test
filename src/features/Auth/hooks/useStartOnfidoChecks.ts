import {useMutation} from '@tanstack/react-query';
import {startOnfidoChecks} from '../services/auth-service';

const useStartOnfidoChecks = () =>
  useMutation({
    mutationFn: (apuId: number) => startOnfidoChecks(apuId),
  });

export default useStartOnfidoChecks;
