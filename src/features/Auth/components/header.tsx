import React from 'react';
import {View, StyleSheet} from 'react-native';

interface HeaderProps {
  variant?: 'white' | 'blue';
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => goBack()}> */}
        {/*   <FontAwesomeIcon */}
        {/*     color={variant === 'white' ? 'white' : 'black'} */}
        {/*     size={30} */}
        {/*     icon={faAngleLeft} */}
        {/*   /> */}
        {/* </TouchableOpacity> */}
        {/* <Logo variant={variant} /> */}
        {/* <TouchableOpacity onPress={handleInfoButtonPressed}> */}
        {/*   <FontAwesomeIcon */}
        {/*     color={variant === 'white' ? 'white' : 'black'} */}
        {/*     size={25} */}
        {/*     icon={faInfoCircle} */}
        {/*   /> */}
        {/* </TouchableOpacity> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
});

export default Header;
