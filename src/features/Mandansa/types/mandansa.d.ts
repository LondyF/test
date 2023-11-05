import {MandansaMsgStatus, MandansaStatus} from './mandansaStatus';

export declare interface MandansaRelation {
  mdsId: number;
  apuId: number;
  apuMdsId: number;
  eindeDt?: any;
  isAktief: number;
  relNaam: string;
  vzkNaam: string;
  tbvNaam: string;
  mdsStatus: MandansaStatus;
  mdsMsgStatus: MandansaMsgStatus;
  frequentie: number;
  relId?: number;
  mds_TKP: string;
  mdsMsg: string;
  isGevalideerd: number;
  apuuser: User;
  mdsTKP: User | string;
}

export interface GetAllMandansas {
  gemachtigde: Array<MandansaRelation>;
  volmacht: Array<MandansaRelation>;
  status: Status;
}

export interface GetAllMandansasResponse {
  mandansa: GetAllMandansas;
}
