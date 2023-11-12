import {useQuery} from '@tanstack/react-query';

import {getAllNotifications} from '../services/notifications-service';
import {GetAllNotficationsResponse} from '../types/notifications';

const useFetchNotifications = (apuId: number) => {
  return useQuery<GetAllNotficationsResponse, {}>({
    queryKey: ['notifications', apuId],
    queryFn: () => getAllNotifications(apuId),
  });
};
export default useFetchNotifications;
