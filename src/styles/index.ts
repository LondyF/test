import {darkGray, darkRed, primaryBlue} from './colors';
import {horizontalPadding, verticalPadding} from './spacing';
import fontStyles from './typography';

import {Theme} from './styles';

export const colors = {
  primary: primaryBlue,
  darkGray: darkGray,
  darkRed: darkRed,
  lightGray: '#dfdfdf',
  gray: '#c7c7c7',
  whiteGray: '#fafafa',
  white: '#ffffff',
};

const defaultTheme: Theme = {
  spacing: {
    horizontalPadding,
    verticalPadding,
  },
  colors: {
    ...colors,
  },
  typography: fontStyles,
  backgroundImage: require('@assets/BackgroundBlue.png'),
};

const fatumTheme: Theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#50329f',
  },
  backgroundImage: require('@assets/FatumBackgroundPurple.png'),
};

const enniaTheme: Theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#17a755',
  },
  backgroundImage: require('@assets/EnniaBackground.png'),
};

export {
  defaultTheme as Theme,
  fatumTheme as FatumTheme,
  enniaTheme as EnniaTheme,
};
