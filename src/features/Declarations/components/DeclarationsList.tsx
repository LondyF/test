import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronRight} from '@fortawesome/pro-solid-svg-icons';
import {faWarning} from '@fortawesome/pro-light-svg-icons';

import {Button, ErrorView, ListItem, Typography} from '@src/components';
import {Theme} from '@src/styles';
import useTheme from '@src/hooks/useTheme';
import {Declaration} from '../types/declarations';
import useFetchDeclarations from '../hooks/useFetchDeclarations';
import {currencyFormatter} from '../utils';
import {DeclarationStatus} from '../types/declarations';
import useDeleteDeclaration from '../hooks/useDeleteDeclaration';

const DeclarationsList = ({
  apuId,
  status,
}: {
  apuId: number;
  status: DeclarationStatus[];
}) => {
  const navigation = useNavigation();
  const {
    colors: {darkGray, gray, primary},
  } = useTheme();

  const {data, isError, isFetching, error, refetch} =
    useFetchDeclarations(apuId);

  const {mutate: deleteDeclaration} = useDeleteDeclaration();

  const keyExtractor = (_: Declaration, index: number) => `${index}`;

  const renderItem = ({
    index,
    item: declaration,
  }: {
    index: number;
    item: Declaration;
  }) => {
    const date = moment(declaration?.datum, true);
    const isValidDate = date.isValid();
    const formattedDate = isValidDate ? date.format('DD MMM YYYY') : '-';

    const isInDraft = declaration.progressId === DeclarationStatus.DRAFT;
    const hasBeenSubmitted =
      declaration.progressId === DeclarationStatus.SUBMITTED;
    const InProgress = declaration.progressId === DeclarationStatus.IN_PROGRESS;
    const actionRequired =
      declaration.progressId === DeclarationStatus.ACTION_REQUIRED;

    const formatCurrency = currencyFormatter(declaration.kurensie);

    const handleDeleteDeclaration = () => {
      if (declaration.progressId !== DeclarationStatus.DRAFT) {
        return;
      }

      Alert.alert(
        'Delete Declaration',
        'Are you sure you want to delete this declaration?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteDeclaration({apuId, sesId: declaration.sesId}),
          },
        ],
      );
    };

    return (
      <ListItem style={styles.listItemContainer} index={index}>
        <TouchableOpacity
          onPress={() =>
            //@ts-ignore
            navigation.navigate('Declaration', {
              sesId: declaration.sesId,
            })
          }
          onLongPress={handleDeleteDeclaration}
          style={styles.itemContainer}>
          <View style={styles.textContainer}>
            <View style={styles.headerTextContainer}>
              <Typography
                variant="h3"
                color={darkGray}
                fontWeight="500"
                textStyle={{marginRight: 5}}
                text={formattedDate}
              />
              <Typography
                variant="h5"
                color="#000"
                fontWeight="500"
                text={`#${declaration.nummer}`}
              />
            </View>
            <View style={styles.extraInfoContainer}>
              <Typography
                variant="h4"
                color="#A0A0A0"
                fontWeight="800"
                fontStyle="italic"
                fontSize={13}
                text={declaration.vkcNaam + ' - ' + declaration.artNaam}
              />

              {(isInDraft || hasBeenSubmitted || InProgress) && (
                <Typography
                  variant="h4"
                  color="#5e5e5e"
                  textStyle={styles.statusText}
                  fontStyle="italic"
                  fontWeight="600"
                  fontSize={12}
                  text={
                    isInDraft
                      ? 'Draft'
                      : hasBeenSubmitted
                      ? 'Submitted'
                      : 'In Progress'
                  }
                />
              )}

              {actionRequired && (
                <View style={styles.actionRequiredContainer}>
                  <FontAwesomeIcon
                    size={12}
                    icon={faWarning}
                    color="#FF0000"
                    style={{marginRight: 6, marginTop: 10}}
                  />
                  <Typography
                    variant="h4"
                    color="#FF0000"
                    textStyle={styles.statusText}
                    fontStyle="italic"
                    fontWeight="600"
                    fontSize={12}
                    text="Action Required"
                  />
                </View>
              )}
            </View>
          </View>
          <View style={styles.rightContainer}>
            <Typography
              variant="h4"
              color={primary}
              fontWeight="bold"
              textStyle={{textAlign: 'right', marginRight: 10}}
              text={formatCurrency(declaration.bedrag)}
            />
            <FontAwesomeIcon size={22} icon={faChevronRight} color={gray} />
          </View>
        </TouchableOpacity>
      </ListItem>
    );
  };

  const renderListEmptyComponent = () => {
    if (isError) {
      return (
        <ErrorView goBack={navigation.goBack} reload={refetch} error={error} />
      );
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

  const filteredData = React.useMemo(() => {
    if (data) {
      return data.filter(declaration =>
        status.includes(declaration.progressId),
      );
    }
    return [];
  }, [data, status]);

  return (
    <FlatList
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.flatListContent}
      renderItem={renderItem}
      data={filteredData}
      ListEmptyComponent={renderListEmptyComponent}
      onRefresh={refetch}
      refreshing={isFetching}
    />
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
    paddingVertical: 10,
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
  },
  extraInfoContainer: {
    marginTop: 4,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  rightContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusText: {
    marginTop: 10,
  },
  actionRequiredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default DeclarationsList;
