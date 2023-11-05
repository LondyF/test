import {useQuery} from '@tanstack/react-query';

import {getAllNotifications} from '../services/notifications-service';
import {GetAllNotficationsResponse} from '../types/notifications';

const useFetchNotifications = (apuId: number) => {
  return useQuery<GetAllNotficationsResponse, {}>(
    ['notifications', apuId],
    () => getAllNotifications(apuId),
  );
};
export default useFetchNotifications;
