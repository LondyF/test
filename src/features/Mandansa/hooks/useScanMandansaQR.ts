import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';

import {scanMandansaQRCode} from '../services/mandansa-service';

interface Values {
  apuId: User['apuId'];
  uuId: number;
  recId: number;
  apuMdsId: number;
}

const useScanMandansaQR = () => {
  return useMutation<any, AxiosError, Values>(
    ({uuId, apuId, recId, apuMdsId}: Values) =>
      scanMandansaQRCode(apuId, uuId, recId, apuMdsId),
  );
};

export default useScanMandansaQR;
