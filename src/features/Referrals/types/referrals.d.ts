export interface Referral {
  id: number;
  datum: Date;
  aanvrager: string;
  diagnose: string;
  art2Vakgroep: string;
  art2Naam: string;
  route: string;
  verzekering: string;
  vzk_status: string;
}

export interface GetAllReferralsResponse {
  status: Status;
  verwijzingen: Referral[];
}

export interface Machtiging {
  id: number;
  datum: Date;
  aanvrager: string;
  diagnose: string;
  art2Vakgroep: string;
  art2Naam: string;
  route: string;
  verzekering: string;
  vzk_status: string;
}

export interface GetAllMachtigingenResponse {
  status: Status;
  machtigingen: Machtiging[];
}
