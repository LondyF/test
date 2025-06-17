import {useQuery} from '@tanstack/react-query';

import {fetchProcedure} from '@features/Declarations/services/declarations-service';
import {Procedure} from '../types/declarations';

type Response = {
  data: Procedure[];
};

const useFetchProcedures = ({
  sqArtId,
  vkcId,
  apuId,
}: {
  sqArtId: number;
  vkcId: number;
  apuId: number;
}) => {
  return useQuery({
    queryKey: ['procedures', sqArtId, vkcId, apuId],
    queryFn: () => fetchProcedure({sqArtId, vkcId, apuId}) as Promise<Response>,
    select: data => data.data,
    enabled: sqArtId !== -1 && vkcId !== -1 && apuId !== -1,
  });
};

export default useFetchProcedures;
