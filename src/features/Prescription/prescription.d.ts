export interface PrescriptionLine {
  id: number;
  rclId: number;
  medId: number;
  aantal: string;
  dosering: string;
  medNaam: string;
  medlovId?: any;
  botId: number;
  m: number;
  l: number;
  p: number;
  w: number;
}
export interface Prescription {
  recId: number;
  recNummer: number;
  vesId: number;
  patId: number;
  botId: number;
  datum: Date;
  patNaam: string;
  sedula: string;
  artNaam: string;
  vesNaam: string;
  botNaam: string;
  pb: string;
  regels: PrescriptionLine[];
}

export interface getAllPrescriptionsResponse {
  recepten: Prescription[];
  status: Status;
}
