export const LANGUAGES: Array<Language> = [
  {
    name: 'Nederlands',
    abbreviation: 'NL',
    icon: require('@assets/icon_nl.png'),
  },
  {
    name: 'English',
    abbreviation: 'EN',
    icon: require('@assets/icon_us.png'),
  },
  {
    name: 'Español',
    abbreviation: 'ES',
    icon: require('@assets/icon_es.png'),
  },
  {
    name: 'Papiamentu',
    abbreviation: 'PA',
    icon: require('@assets/icon_cw.png'),
  },
  {
    name: '中国人',
    abbreviation: 'CH',
    icon: require('@assets/icon_ch.png'),
  },
];

export const INSURERS: Array<Insurer> = [
  {
    name: 'S.V.B',
    id: 301,
    logo: require('@assets/SVBLogo.png'),
    banner: require('@assets/svb_balk.png'),
  },
  {
    name: 'Ennia',
    id: 302,
    logo: require('@assets/EnniaLogo.png'),
    banner: require('@assets/ennia_balk.png'),
  },
  {
    name: 'Fatum',
    id: 300,
    logo: require('@assets/LogoGuardian.png'),
    banner: require('@assets/fatum_balk.png'),
  },
  {
    name: 'N/A',
    id: -1,
    logo: require('@assets/MiSaluLogoSmall.png'),
    banner: require('@assets/svb_balk.png'),
  },
];

export enum Insurers {
  Fatum = 300,
  SVB,
  Ennia,
}

export const COUNTRIES: Array<Country> = [
  {
    name: 'Curacao',
    abbreviation: 'CUR',
    prefix: '5999',
  },
  {
    name: 'Bonaire',
    abbreviation: 'BON',
    prefix: '599',
  },
  {
    name: 'St. Maarten',
    abbreviation: 'SXM',
    prefix: '599',
  },
];

export const GENDERS: Array<{ name: string; short: string }> = [
  {
    name: 'Male',
    short: 'M',
  },
  {
    name: 'Female',
    short: 'F',
  },
];

export enum TransactionTypes {
  KaartControle = 1,
  LabAanvraag = 2,
  Recept = 4,
  Mandansa,
  PermanenteTikkie,
}
