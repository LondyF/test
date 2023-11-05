import {Theme as DefaultTheme, FatumTheme, EnniaTheme} from '@src/styles';
import {Insurers} from '@src/constants';
import useAuthStore from '@src/stores/useAuthStore';
import {Theme as ThemeType} from '@src/styles/styles';
const useTheme = () => {
  const user = useAuthStore(state => state.user);
  var Theme = {};

  if (!user) {
    return (Theme = {...DefaultTheme});
  }

  if (user.vzkId === Insurers.Ennia) {
    Theme = {...EnniaTheme};
  } else if (user.vzkId === Insurers.Fatum) {
    Theme = {...FatumTheme};
  } else {
    Theme = {...DefaultTheme};
  }
  return Theme as ThemeType;
};

export default useTheme;
