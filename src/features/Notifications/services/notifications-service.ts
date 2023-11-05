import request from '@utils/request';

export const getAllNotifications = async (apuId: number) =>
  await request({
    url: '/app-rn1/notification/all',
    method: 'POST',
    data: {
      apuId,
    },
  });

export const deleteNotification = async (
  apuId: number,
  notificationId: number,
) =>
  await request({
    url: '/app-rn1/notification/all',
    method: 'POST',
    data: {
      apuId,
      chaId: notificationId,
      callType: 2,
    },
  });
