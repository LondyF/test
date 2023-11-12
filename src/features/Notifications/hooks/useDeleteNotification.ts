import {AxiosError} from 'axios';
import {useQueryClient, useMutation} from '@tanstack/react-query';

import useToast from '@components/Toast/useToast';
import {ToastTypes} from '@components/Toast/toastTypes';

import {deleteNotification} from '../services/notifications-service';
import {
  DeleteNotificationResponse,
  GetAllNotficationsResponse,
} from '../types/notifications';

type Values = {
  notificationId: number;
};

const useDeleteNotification = (apuId: number) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation<DeleteNotificationResponse, AxiosError, Values>({
    mutationFn: ({notificationId}) => deleteNotification(apuId, notificationId),
    onMutate: async ({notificationId}) => {
      await queryClient.cancelQueries({queryKey: ['notifications']});

      const prevNotifications =
        queryClient.getQueryData<GetAllNotficationsResponse>([
          'notifications',
          apuId,
        ]);
      if (prevNotifications) {
        const filteredNotifications =
          prevNotifications.notifications.data.filter(
            x => x.id === notificationId,
          );

        queryClient.setQueryData<GetAllNotficationsResponse>(
          ['notifications', apuId],
          {
            notifications: {
              data: [...filteredNotifications],
              status: prevNotifications.notifications.status,
            },
          },
        );
      }
      return {
        prevNotifications,
      };
    },
    onError() {
      queryClient.invalidateQueries({queryKey: ['notifications', apuId]});
      toast('something went wrong', ToastTypes.ERROR);
    },
    onSuccess() {
      queryClient.invalidateQueries({queryKey: ['notifications', apuId]});
      toast('Successfully deleted notification', ToastTypes.SUCCESS);
    },
  });
};

export default useDeleteNotification;
