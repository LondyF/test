declare interface Language {
  name: string;
  abbreviation: string;
  icon: import('react-native').ImageSourcePropType;
}

declare interface Country {
  name: string;
  abbreviation: string;
  prefix: string;
}

declare interface Insurer {
  name: string;
  id: number;
  logo: import('react-native').ImageSourcePropType;
  banner: import('react-native').ImageSourcePropType;
}

declare interface Status {
  status: number;
  msgid: number;
  msg: string;
  msg2?: any;
}

declare interface Lov {
  id: number;
  flag: number;
  naam: string;
  tabNaam: string;
}

declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
