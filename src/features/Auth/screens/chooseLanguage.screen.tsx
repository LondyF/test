import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useTranslation} from 'react-i18next';

import useAuthStore from '@src/stores/useAuthStore';
import {LANGUAGES} from '@src/constants';
import {Theme} from '@styles/index';
import {PageContainer, Typography, Button} from '@components/index';

import Box from '../components/box';
import Header from '../components/header';

const ChooseLanguageScreen: React.FC = () => {
  const {i18n} = useTranslation();
  const [user, storeUser] = useAuthStore(state => [state.user, state.setUser]);
  const [selectedLanguageIndex, setSelectedLangIndex] = useState<number>(0);
  const {navigate} = useNavigation();

  const renderItem = ({index, item}: {index: number; item: Language}) => (
    <TouchableOpacity
      onPress={() => setSelectedLangIndex(index)}
      key={index}
      style={styles.languageOption}>
      <View style={styles.languageOptionContainer}>
        <Image style={styles.languageIcon} source={item.icon} />
        <Typography variant="b1" text={item.name} align="center" />
      </View>
      <View
        style={
          selectedLanguageIndex !== index
            ? styles.checkBox
            : styles.checkBoxSelected
        }
      />
    </TouchableOpacity>
  );

  const keyExtractor = (_: Language, index: number) => `${index}`;

  const handleContinue = () => {
    const selectedLang = LANGUAGES[selectedLanguageIndex].abbreviation;

    storeUser({
      language: selectedLang,
      ...user,
    });

    i18n.changeLanguage(selectedLang);
    navigate('ChooseSettings');
  };

  return (
    <PageContainer>
      <View style={styles.container}>
        <Header variant="blue" />
        <View style={styles.content}>
          <Typography
            variant="h1"
            text="Choose Your Language"
            color={Theme.colors.primary}
            align="center"
          />
          <Box style={styles.box}>
            <FlatList<Language>
              data={LANGUAGES}
              style={styles.flatList}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          </Box>
        </View>
        <Button
          buttonStyle={styles.button}
          text="Continue"
          onPress={handleContinue}
        />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 25,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -50,
  },
  box: {
    marginVertical: 55,
  },
  flatList: {
    flexGrow: 0,
  },
  languageOption: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIcon: {
    width: 22.5,
    height: 22.5,
    resizeMode: 'contain',
    marginRight: 10,
  },
  languageSelected: {
    backgroundColor: '#dfdfdf',
  },
  checkBox: {
    width: 22.5,
    height: 22.5,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 12.25,
    alignSelf: 'flex-end',
  },
  checkBoxSelected: {
    width: 22.5,
    height: 22.5,
    borderRadius: 12.25,
    alignSelf: 'flex-end',
    borderColor: 'lightgray',
    backgroundColor: Theme.colors.primary,
  },
  button: {
    alignSelf: 'stretch',
  },
});

export default ChooseLanguageScreen;
