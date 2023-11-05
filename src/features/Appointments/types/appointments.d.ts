export interface AppointmentDay {
  day: string;
  date: Date;
  appointments: Appointment[];
}

export interface GetAllAppointmentsResponse {
  appointments: Appointment[];
}

export interface Appointment {
  id: number;
  datum: Date;
  status: number;
  confirmed: number;
  canChange: string;
  lokatie: string;
  adres: string;
  subject: string;
  docter: Docter[];
  statusTxt: string;
}

export interface Docter {
  vesId: number;
  id: number;
  naam: string;
  sqArtId: number;
}
