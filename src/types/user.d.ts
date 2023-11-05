declare interface User {
  language: string;
  apuId: number;
  biometricEnabled: boolean;
  locationEnabled: boolean;
  cameraEnabled: boolean;
  acceptManDansa: number;
  account: string;
  adres: string;
  artNaam: string;
  artVesId: number;
  dob: Date;
  email: string;
  foto: string;
  idNummer: string;
  isAppCreated: number;
  isGevalideerd: number;
  isValid: number;
  lang: Language['abbreviation'];
  lndKde: string;
  vzkId: number;
  vzk2Id: number;
  vzkStatus: string;
  vzk2Status: number;
  naam: string;
  sex: string;
  sms: string;
  sqArtId: number;
  vzk2Naam: string;
  vzkNaam: string;
  pin: string;
  needPhotoId: number;
  biometricPassword: string;
  validationStatus: number;
  device: Device;
  firstName: string;
  showDeclarations: number;
  allowAppVis: number;
  optOut: number;
  imgComp: number;
}

interface Device {
  AantalDevices: number;
  LastConnect: Date;
  appVersie: number;
  devId: number;
  deviceId: string;
  deviceName: string;
  deviceNr: number;
  needUpdate: number;
  releaseNr: string;
  osVersie: string;
}
