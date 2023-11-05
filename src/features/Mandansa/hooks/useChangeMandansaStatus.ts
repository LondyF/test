import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';

import {changeMandansaStatus} from '../services/mandansa-service';
import {MandansaRelation} from '../types/mandansa';

export type values = {
  relation: MandansaRelation;
};

const useChangeMandansaStatus = () => {
  return useMutation<{}, AxiosError, values>(
    ({relation}: values) =>
      changeMandansaStatus(relation.mdsId, relation.mdsStatus),
    {},
  );
};
export default useChangeMandansaStatus;
