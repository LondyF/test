import {LabResultRuleType} from './labResultRuleType';
import {HomeAppointment} from '../hooks/useBookHomeAppointment';

export declare interface Laboratory {
  bogId: number;
  id: number;
  grpNaam: string;
  grpNaam2: string;
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

export interface GetAllLaboratories {
  prikposten: Array<Laboratory>;
  status: Status;
}

export interface GetAllLaboratoriesResponse {
  prikpost: GetAllLaboratories;
}

export interface LabRequest {
  avaId: number;
  labNummer: number;
  vesId: number;
  patId: number;
  datum: Date;
  patNaam: string;
  sedula: string;
  artNaam: string;
  vesNaam: string;
  prkNaam: string;
  avaSqArtId: number;
  avaSqArtIdCc: number;
  prikLokId: number;
  groep: LabRequestTestGroup[];
  showQr: number;
  showThuisPrikken: number;
  statusMsg?: string;
}

export interface LabRequestTestGroup {
  tsg_id: number;
  tsg_naam: string;
  tel: number;
  testen: LabRequestTest[];
}

export interface LabRequestTest {
  avaId: number;
  id: number;
  isAangeleverd: string;
  isPrikSel: string;
  isPrikSelected: string;
  prkId: number;
  tekst: string;
  tsgId: number;
  tsgNaam: string;
  tstId: number;
  tst_naam: string;
}

export interface GetAllLabRequests {
  data: Array<LabRequest>;
  status: Status;
}

export interface GetAllLabRequestsResponse {
  aanvragen: GetAllLabRequests;
}

export interface LabResult {
  id: number;
  datecreated: Date;
  keo_id: number;
  sedula: string;
  pnr: string;
  avaId: number;
  lnr: string;
  avaArts: string;
  type: string;
  lab: string;
  verwerkDatumTijd: Date;
  uitslag: LabResultRule[];
  prikDatum: Date;
  naam: string;
}

export interface Lab {
  data: LabResult[];
  keoId: number;
  lab: string;
  status: Status;
  vesId: string;
}

export interface LabResults {
  uitslagen: Lab;
}

export interface GetAllLabResults {
  status: Status;
  data: LabResults[];
}

export interface GetAllLabResultsResponse {
  labUitslagen: GetAllLabResults;
}

export interface DetailedLabResult {
  avaId: number;
  data: LabResultRule[];
  keoId: number;
  lab: string;
}

export interface LabResultRule {
  eenheid: string;
  groep: string;
  hoogLaag: string;
  id: number;
  noot: string;
  nr: number;
  recType: LabResultRuleType;
  refWaarde: string;
  srt: number;
  test: string;
  tstId: number;
  uitslag: string;
}

export interface GetLabResultResponse {
  uitslag: DetailedLabResult;
}

export interface GetHomeAppointmentResponse {
  labs: HomeAppointmentLab[];
  status: Status;
  userInfo: HomeAppointment;
}

export interface HomeAppointmentLab {
  id: number;
  naam: string;
  naamFull: string;
}
