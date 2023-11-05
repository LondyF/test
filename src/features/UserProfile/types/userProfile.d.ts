export interface SaveProfile {
  apuuser: User;
  status: Status;
}

export interface SaveProfileResponse {
  app: SaveProfile;
}

export interface AuthUserWithQR {
  status: Status;
}

export interface AuthUserWthQRResponse {
  readQR: AuthUserWithQR;
}
