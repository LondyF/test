export interface Medicine {
  vesId: number;
  patId: number;
  medNaam: string;
  dosering: string;
  lastDt: Date;
  aantal: number;
}

export interface GetMyMedicationsResponse {
  medicijnlijst: Medicine[];
  status: Status;
}
