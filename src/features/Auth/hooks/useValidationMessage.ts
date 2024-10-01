import {useQuery} from '@tanstack/react-query';
import {getValidationMessage} from '../services/auth-service';

const useValidationMessage = (apuId: number) => {
  return useQuery<ValidationMessageReponse>({
    queryKey: ['get_validation_messagef', apuId],
    queryFn: async () => getValidationMessage(apuId),
    enabled: !!apuId,
    staleTime: 1000 * 60 * 90, //90 minutes,
  });
};

export default useValidationMessage;
