import {useQuery} from '@tanstack/react-query';
import {getOnfidoSDKToken} from '../services/auth-service';

const useFetchOnfidoSDKToken = (
  apuId: number | undefined,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['onfido_sdk_token', apuId],
    queryFn: async () => getOnfidoSDKToken(apuId!),
    enabled: !!apuId && enabled,
    staleTime: 1000 * 60 * 90, //90 minutes,
  });
};

export default useFetchOnfidoSDKToken;
