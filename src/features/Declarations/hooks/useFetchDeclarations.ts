import {useQuery} from '@tanstack/react-query';

import {fetchAllDeclaration} from '../services/declarations-service';
import {Declaration} from '../types/declarations';

const useFetchDeclarations = (apuId: number) =>
  useQuery<Declaration[]>({
    queryKey: ['declarations', apuId],
    queryFn: () => fetchAllDeclaration(apuId),
  });

export default useFetchDeclarations;
