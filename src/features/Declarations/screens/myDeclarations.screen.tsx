import React, {useState} from 'react';

import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {faPlus} from '@fortawesome/pro-solid-svg-icons';
import Modal from 'react-native-modal';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {
  Button,
  ErrorView,
  FloatingActionButton,
  ListItem,
  Loader,
  Typography,
} from '@src/components';
import {Theme} from '@src/styles';
import {convertISOdate} from '@utils/utils';
import useAuthStore from '@stores/useAuthStore';
import useTheme from '@hooks/useTheme';
import useInternetConnection from '@hooks/useInternetConnection';

import UserBankInfoModal from '../components/UserBankInfoModal';
import useFetchDeclarations from '../hooks/useFetchDeclarations';
import {Declaration} from '../types/declarations';

const {
  colors: {darkGray, gray},
} = Theme;

const MyDeclarations = () => {
  const {checkIfConnected} = useInternetConnection();
  const {showActionSheetWithOptions} = useActionSheet();
  const {t} = useTranslation();
  const user = useAuthStore(state => state.user);
  const {data, isError, isFetching, error, refetch, isLoading} =
    useFetchDeclarations(user?.apuId || -1);
  const {navigate, goBack} = useNavigation();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const theme = useTheme();

  const showOptions = () => {
    checkIfConnected(() => {
      const options = [
        t('declarations.newDeclaration'),
        t('declarations.accountInformation'),
        t('common.cancel'),
      ];
      const cancelButtonIndex = options.length - 1;
      showActionSheetWithOptions(
        {options: options, cancelButtonIndex},
        buttonIndex => {
          let chosenOption = options[buttonIndex];
          if (chosenOption === options[1]) {
            setModalVisible(true);
          }
          if (chosenOption === options[0]) {
            navigate('NewDeclaration');
          }
        },
      );
    });
  };

  const keyExtractor = (_: Declaration, index: number) => `${index}`;

  const renderItem = ({
    index,
    item: declaration,
  }: {
    index: number;
    item: Declaration;
  }) => {
    return (
      <ListItem style={styles.listItemContainer} index={index}>
        <TouchableOpacity
          onPress={() => navigate('DeclarationGallery', {declaration})}
          style={styles.itemContainer}>
          <View style={styles.textContainer}>
            <View style={styles.headerTextContainer}>
              <Typography
                variant="h3"
                color={darkGray}
                fontWeight="bold"
                text={`${declaration.naam} - `}
              />
              <Typography
                textStyle={styles.statusText}
                numberOfLines={1}
                ellipsizeMode="tail"
                variant="h3"
                color={darkGray}
                text={`Status: ${declaration.status} `}
              />
            </View>
            <View style={styles.extraInfoContainer}>
              <Typography
                variant="h4"
                color={gray}
                text={t('declarations.declared')}
              />
              <Typography
                variant="h4"
                color={gray}
                text={convertISOdate(declaration.datum)}
              />
              <Typography
                variant="h4"
                color={gray}
                text={`${declaration.bedragTot} ANG`}
              />
            </View>
          </View>
          <View style={styles.photosAmountContainer}>
            <View style={styles.photosAmountCircle}>
              <Typography
                text={declaration.fotos.length.toString()}
                fontWeight="bold"
                variant="b1"
                fontSize={18}
                color="white"
              />
            </View>
          </View>
        </TouchableOpacity>
      </ListItem>
    );
  };

  const renderListEmptyComponent = () => {
    if (isError) {
      return <ErrorView goBack={goBack} reload={refetch} error={error} />;
    }
    return (
      <View style={styles.noDeclarationsFoundContainer}>
        <Typography
          textStyle={styles.noDeclarationsFoundText}
          text="Geen declaraties gevonden"
          variant="h4"
        />
        <Button onPress={() => refetch()} variant="primary" text="refresh" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <Loader
        textColor={theme.colors.primary}
        indicatorColor={theme.colors.primary}
        text={'loading declarations'}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        onBackdropPress={() => setModalVisible(false)}
        isVisible={isModalVisible}>
        <KeyboardAvoidingView behavior="position">
          <UserBankInfoModal closeModal={() => setModalVisible(false)} />
        </KeyboardAvoidingView>
      </Modal>
      <FlatList
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatListContent}
        renderItem={renderItem}
        data={data && data.catalog.data.filter(x => x.fotos.length > 0)}
        ListEmptyComponent={renderListEmptyComponent}
        onRefresh={refetch}
        refreshing={isFetching}
      />
      <FloatingActionButton icon={faPlus} onPress={showOptions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flatListContent: {
    flexGrow: 1,
  },
  listItemContainer: {
    paddingVertical: 15,
  },
  itemContainer: {
    paddingHorizontal: Theme.spacing.horizontalPadding,
    paddingVertical: 15,
    flexDirection: 'row',
  },
  textContainer: {
    flex: 0.85,
  },
  extraInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  headerTextContainer: {
    flexDirection: 'row',
  },
  photosAmountCircle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photosAmountContainer: {
    flex: 0.15,
    alignItems: 'flex-end',
  },
  statusText: {
    flexShrink: 1,
  },
  noDeclarationsFoundText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  noDeclarationsFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default MyDeclarations;

// 3324
