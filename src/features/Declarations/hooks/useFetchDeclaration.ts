import {useQuery} from '@tanstack/react-query';

import {fetchDeclarationSession} from '../services/declarations-service';
import {Declaration} from '../types/declarations';

const useFetchDeclaration = (apuId: number, sesId: string) =>
  useQuery({
    queryKey: ['declaration', apuId, sesId],
    queryFn: () =>
      fetchDeclarationSession({
        apuId,
        sesId,
      }) as Promise<Declaration[]>,
    select: data => data[0],
  });

export default useFetchDeclaration;
