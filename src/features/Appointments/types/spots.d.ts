export interface GetAvailableSpotsResponse {
  allSpots: Array<AvailableSpotDate>;
}

export interface AvailableSpotDate {
  aantal: number;
  datum: Date;
  spots: Spot[];
}

export interface AvailableDoctor {
  mdwId: number;
  naam: string;
}

export interface Spot {
  mI: number;
  r: number;
  t: string;
  tI: number;
  ti: Date;
}

export interface DoctorEstablishmentSpot {
  naam: string;
  vesId: number;
  arts: Array<AvailableDoctor>;
}
export interface GetAvailableDoctorEstablishmentResponse {
  allSpots: Array<DoctorEstablishmentSpot>;
}

export interface BookAppointmentResponse {
  allSpots: Array<DoctorEstablishmentSpot>;
  status: Status;
}
