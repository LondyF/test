import {useQuery} from '@tanstack/react-query';

import {fetchAllDeclaration} from '../services/declarations-service';
import {GetAllDeclariontsReponse} from '../types/declarations';

const useFetchDeclarations = (apuId: number) =>
  useQuery<GetAllDeclariontsReponse>('declarations', () =>
    fetchAllDeclaration(apuId),
  );

export default useFetchDeclarations;
