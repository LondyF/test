export interface Notification {
  id: number;
  createDatum: Date;
  readDatum: Date;
  new: number;
  read: number;
  geopend: number;
  urgent: number;
  van: string;
  onderwerp: string;
  tekst: string;
}

export interface Notifications {
  status: Status;
  data: Notification[];
}

export interface GetAllNotficationsResponse {
  notifications: Notifications;
}

export interface DeleteNotificationResponse {
  notifications: Notifications;
}
