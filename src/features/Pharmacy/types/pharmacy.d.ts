export declare interface Pharmacy {
  bogId: number;
  id: number;
  grpNaam: string;
  naam: string;
  adres: string;
  lndKde: string;
  lat: number;
  lng: number;
  unico: string;
  openClose: string;
  so: number;
  naWarda: Date;
  telefoon: string;
  startdate: Date;
}

export interface GetAllPharmacies {
  botikas: Array<Pharmacy>;
  status: Status;
}

export interface GetAllPharmaciesResponse {
  botika: GetAllPharmacies;
}
