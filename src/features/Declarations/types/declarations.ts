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

export interface DeclarationLine {
  aantal: number;
  kode: string;
  tekst: string;
  bedrag: number;
  betaald: number | null;
}

export const DeclarationStatus = {
  DRAFT: 1,
  SUBMITTED: 2,
  IN_PROGRESS: 3,
  ACTION_REQUIRED: 4,
  COMPLETED: 5,
} as const;

export type DeclarationStatus =
  (typeof DeclarationStatus)[keyof typeof DeclarationStatus];

export const DeclarationAdditionalInfo = {
  FOTO_UNCLEAR: 1,
  INCORRECT_LINES: 2,
  FREE_TEXT: 99,
};

export type DeclarationAdditionalInfo =
  (typeof DeclarationAdditionalInfo)[keyof typeof DeclarationAdditionalInfo];

export interface Declaration {
  StatusIco: number;
  StatusInfo: unknown;
  artNaam: string;
  bedrag: number;
  betaald: number;
  datum: Date;
  foto: string;
  lndKde: string;
  nummer: number;
  regels: DeclarationLine[];
  scaId: number;
  sesId: string;
  sqArtId: number;
  status: DeclarationStatus;
  vkcId: number;
  vkcNaam: string;
  kurensie: string;
  progressId: DeclarationStatus;
  freeTxt: number;
  addInfo: string;
  addInfoId: DeclarationAdditionalInfo;
}

export interface Procedure {
  id: number;
  naam: string;
  kode: string;
}

export interface GetAllDeclarations {
  data: Declaration[];
  status: Status;
}

export interface GetAllDeclariontsReponse {
  data: Declaration[];
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
