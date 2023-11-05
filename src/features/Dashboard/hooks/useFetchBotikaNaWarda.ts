import {useQuery} from '@tanstack/react-query';
import {BotikaNaWardaResponse} from '../dashboard';
import {fetchBotikaNaWarda} from '../services/dashboard-service';

const useFetchBotikaNaWarda = (apuId: number) => {
  return useQuery<BotikaNaWardaResponse, {}>('', () =>
    fetchBotikaNaWarda(apuId),
  );
};

export default useFetchBotikaNaWarda;
