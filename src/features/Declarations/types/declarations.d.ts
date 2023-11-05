export interface GetUserBankInfoResponseInfo {
  bankinfo: BankInfo;
}

export interface BankInfo {
  rekeningNummer: string;
  tnv: string;
  bank: Bank;
}

export interface Bank {
  id: number;
  naam: string;
}

export interface Type {
  id: number;
  naam: string;
}

export interface Photo {
  id: number;
  galId: number;
  bedrag: number;
  betaald: number;
  foto: string;
  type: Type;
}

export interface Declaration {
  datum: Date;
  naam: string;
  status: string;
  datumBtl?: Date;
  bedragTot: number;
  bedragBtl: number;
  aantal: number;
  fotos: Photo[];
}

export interface GetAllDeclarations {
  data: Declaration[];
  status: Status;
}

export interface GetAllDeclariontsReponse {
  catalog: GetAllDeclarations;
}

export interface SaveDeclarationResponse {
  scan: SaveDeclaration;
}
export interface SaveDeclaration {
  status: Status;
}

export interface SaveBankInfoResponse {
  bankinfo: SaveBankInfo;
}
export interface SaveBankInfo {
  status: Status;
}
