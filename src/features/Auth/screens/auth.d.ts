/*
  Json response for validating licenses
*/

interface ValidateLicense {
  status: Status;
  auth: Creds;
  biometric: string;
  apuuser: User;
  device: any;
}

interface ValidateLicenseResponse {
  check: ValidateLicense;
}

interface Creds {
  bearer: string;
  sesToken: string;
  bearerExpSec: number;
  bearerExpTime: string;
}

/*
  JSON response for uploading images
*/

interface UploadFotoId {
  fotoUrl: string;
  status: Status;
}

interface UploadPhotoOfIdResponse {
  uploadFotoId: UploadFotoId;
}

/*
  JSON response for check sedula
*/

interface CheckSedula {
  status: Status;
}

interface CheckSedulaResponse {
  check: CheckSedula;
}

/*
  JSON response for forgetting Password
*/

interface ResetPassword {
  email: string;
  status: Status;
}

interface ResetPasswordResponse {
  access: ResetPassword;
}
