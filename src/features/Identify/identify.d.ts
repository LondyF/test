export interface Transaction {
  trnid: number;
  orgid?: any;
  refId?: any;
  startdt: Date;
  mdsId: number;
  isexpired: string;
  isresultaat: string;
  isbeeindigd: string;
  secondes: number;
  resultaat?: any;
  trn_type: string;
  apuser: User;
  volmacht?: any;
  status: Status;
}

export interface PollAppResponse {
  transaktie: Transaction;
}

export interface TransactionResult {
  botika: string;
  geldig: string;
  mf: string;
  msg: string;
  naam: string;
  polis: any;
  sedula: string;
  mdsUser?: User;
  mdsId?: number;
  status: Status;
  vzkId: number;
}

export interface TransactionResultResponse {
  trnResult: TransactionResult;
  vzkId: number;
  status: Status;
}
