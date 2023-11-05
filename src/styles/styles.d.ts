import {TextStyle} from 'react-native';

/*
    Fonts
*/
declare type FontVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'b1'
  | 'b2';

declare type FontVariants = Record<FontVariant, TextStyle>;

declare interface Theme {
  colors: Colors;
  spacing: Spacing;
  typography: FontVariants;
  backgroundImage: any;
}

declare interface Spacing {
  horizontalPadding: number;
  verticalPadding: number;
}

declare interface Colors {
  primary: string;
  darkGray: string;
  darkRed: string;
  lightGray: string;
  whiteGray: string;
  white: string;
  gray: string;
}
