import React, {useCallback} from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';

import {Typography} from '@src/components';
import {deleteTmpFolder} from '@src/utils';
import {Theme} from '@styles/styles';

interface DrawerProps {
  props: DrawerContentComponentProps<DrawerContentOptions>;
  theme: Theme;
  user: User;
  logoutUser: Function;
}

const Drawer: React.FC<DrawerProps> = ({props, theme, user, logoutUser}) => {
  const {t} = useTranslation();

  const handleClick = () => {
    const url = 'https://static.misalu.live/extra-covid-informatie.html';
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const handleLogout = useCallback(() => {
    logoutUser();
    deleteTmpFolder();
  }, [logoutUser]);

  return (
    <View style={styles.flex}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.ImageBackground}
          source={theme.backgroundImage}>
          <View style={styles.wrapper}>
            <View style={styles.profilePictureContainer}>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: user.foto,
                  headers: {
                    Pragma: 'no-cache',
                    'Cache-Control': 'no-cache, no-store',
                    Expires: '0',
                  },
                }}
              />
            </View>
            <View>
              <Text
                style={
                  styles.nameText
                }>{`${user.firstName} ${user.naam}`}</Text>
              <Text style={styles.idNumberText}>{user.idNummer}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
      <DrawerContentScrollView
        contentContainerStyle={styles.scrollViewContent}
        {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Extra Covid Information"
          onPress={() => handleClick()}
        />
        <DrawerItem label={t('dashboard.help')} onPress={() => handleClick()} />
      </DrawerContentScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Typography
            color={theme.colors.darkRed}
            fontWeight="500"
            variant="b1"
            text="Logout"
          />
        </TouchableOpacity>
        <Typography
          variant="b2"
          fontStyle="italic"
          color={theme.colors.darkGray}
          text={`Version Number: ${user?.device?.releaseNr ?? ''}`}
          textStyle={styles.versionText}
        />
        <Typography
          variant="b2"
          color={theme.colors.darkGray}
          fontStyle="italic"
          text={`DeviceNr: ${user?.device?.deviceNr ?? 0}`}
        />
        <Typography
          variant="b2"
          color={theme.colors.darkGray}
          fontStyle="italic"
          text={`Last Login: ${user?.device?.LastConnect ?? ''}`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    width: 300,
    padding: 0,
  },
  scrollViewContent: {
    paddingTop: 10,
    flex: 1,
  },
  flex: {
    flex: 1,
    padding: 0,
  },
  ImageBackground: {
    flex: 1,
    width: 300,
    paddingHorizontal: 12,
    paddingTop: 15,
  },
  container: {
    width: 300,
    height: 200,
  },
  wrapper: {
    justifyContent: 'center',
    flex: 1,
  },
  profilePictureContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 40,
    marginBottom: 12,
  },
  profilePicture: {
    flex: 1,
    borderRadius: 80 / 2,
  },
  nameText: {
    color: 'white',
    fontWeight: 'bold',
  },
  idNumberText: {
    color: 'white',
  },
  bottomContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  versionText: {
    marginBottom: 5,
  },
  logoutButton: {
    marginBottom: 20,
  },
});

export default Drawer;
