import React from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Typography} from '@src/components';
import {FlatList} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import moment from 'moment';

import {RouteProp, StackActions, useNavigation} from '@react-navigation/native';
import useAuthStore from '@src/stores/useAuthStore';

import useFetchDeclaration from '../hooks/useFetchDeclaration';

import PhotoModal from '@features/Declarations/components/PhotoModal';
import DeclarationImageButton from '@features/Declarations/components/DeclarationImageButton';
import AddDeclarationLineSheet, {
  AddDeclarationLineSheetRef,
} from '@features/Declarations/components/AddDeclarationLineSheet';
import DeclarationSubmittedSheet, {
  DeclarationSubmittedSheetRef,
} from '../components/DeclarationSubmittedSheet';
import {Theme} from '@src/styles/styles';
import useTheme from '@src/hooks/useTheme';
import {
  Declaration,
  DeclarationLine,
  DeclarationStatus,
} from '../types/declarations';
import useToast from '@src/components/Toast/useToast';
import {ToastTypes} from '@src/components/Toast/toastTypes';
import useSubmitDeclaration from '../hooks/useSubmitDeclaration';
import {faChevronLeft} from '@fortawesome/pro-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faWarning} from '@fortawesome/pro-light-svg-icons';
import {faWarning as faWaringSolid} from '@fortawesome/pro-solid-svg-icons';

import {currencyFormatter} from '../utils';
import ActionRequiredSheet, {
  ActionRequiredSheetRef,
} from '../components/ActionRequiredSheet';

const LINEAR_BACKGROUND_COLORS = ['#50329F', '#8F76CF', '#AE98E7', '#FFFFFF'];
const LINEAR_BACKGROUND_LOCATIONS = [0, 0.17, 0.31, 1];

const DeclarationLineItem = ({
  item,
  onPress,
  onLongPress,
  formatCurrency,
  canEdit,
}: {
  item: DeclarationLine;
  onPress: (item: DeclarationLine) => void;
  onLongPress: (item: DeclarationLine) => void;
  formatCurrency: (amount: number) => string;
  canEdit: boolean;
}) => {
  const {tekst, bedrag, aantal: aantalFromItem} = item;

  const theme = useTheme();

  const aantal = aantalFromItem ?? 1;
  const total = aantal * bedrag;

  const styles = createStyle(theme);

  return (
    <TouchableOpacity
      disabled={!canEdit}
      style={[
        styles.declarationLineItem,
        !canEdit && {backgroundColor: 'rgba(255, 255, 255, 0.05)'},
      ]}
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}>
      <View style={styles.flex}>
        <Typography
          variant="h5"
          text={tekst}
          fontWeight="500"
          color="white"
          textStyle={{marginBottom: 2}}
          numberOfLines={1}
        />
        <Typography
          variant="h6"
          text={`${aantal}x ${formatCurrency(bedrag)}`}
          fontWeight="500"
          color="rgba(255, 255, 255, 0.63)"
          textStyle={{marginBottom: 5}}
        />
      </View>
      <Typography
        variant="h4"
        text={formatCurrency(total)}
        fontWeight="500"
        color="white"
        numberOfLines={1}
        textStyle={{marginBottom: 5}}
      />
    </TouchableOpacity>
  );
};

const EmptyList = ({isLoading = true}: {isLoading?: boolean}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        marginTop: 50,
      }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        <Typography
          variant="h5"
          text="No declaration lines added yet. Tap 'Add line' to start."
          color="rgba(255, 255, 255, 0.63)"
          textStyle={{textAlign: 'center'}}
        />
      )}
    </View>
  );
};

type Props = {
  route: RouteProp<{params: {sesId: string}}, 'params'>;
};

const DeclarationScreen = ({route}: Props) => {
  const {sesId} = route.params;

  const toast = useToast();
  const navigation = useNavigation();

  const theme = useTheme();

  const user = useAuthStore(state => state.user);
  const {data: declaration, isPending: isFetchingDeclaration} =
    useFetchDeclaration(user?.apuId!, sesId);

  const {mutate, isPending} = useSubmitDeclaration();

  const [isPhotoModalVisible, setIsPhotoModalVisible] = React.useState(false);
  const [declarationLines, setDeclarationLines] = React.useState<
    DeclarationLine[]
  >(declaration?.regels ?? []);

  const formatCurrency = currencyFormatter(declaration?.kurensie);

  const canEdit =
    declaration?.progressId === DeclarationStatus.ACTION_REQUIRED ||
    declaration?.progressId === DeclarationStatus.DRAFT;

  React.useEffect(() => {
    if (declaration?.regels) {
      setDeclarationLines(declaration.regels);
    }
  }, [declaration?.regels]);

  React.useEffect(() => {
    if (declaration?.progressId === DeclarationStatus.ACTION_REQUIRED) {
      actionRequiredSheetRef.current?.present({
        additionalInfo: declaration?.addInfo ?? '',
        additionalInfoId: declaration?.addInfoId ?? 1,
        apuId: user?.apuId!,
        sesId: declaration?.sesId ?? '',
      });
    }
  }, [
    declaration?.progressId,
    declaration?.addInfo,
    declaration?.addInfoId,
    declaration?.sesId,
    user?.apuId,
  ]);

  React.useEffect(() => {
    if (declaration?.progressId === DeclarationStatus.SUBMITTED) {
      declarationSubmittedSheetRef.current?.present(declaration);
    }
  }, [declaration?.progressId, declaration]);

  const addLineSheetRef = React.useRef<AddDeclarationLineSheetRef>(null);
  const declarationSubmittedSheetRef =
    React.useRef<DeclarationSubmittedSheetRef>(null);
  const actionRequiredSheetRef = React.useRef<ActionRequiredSheetRef>(null);

  const handlePresentModalPress = React.useCallback(() => {
    addLineSheetRef.current?.present();
  }, []);

  const styles = createStyle(theme);

  const keyExtractor = React.useCallback(
    (_: unknown, index: number) => `declaration-${index}`,
    [],
  );

  const handleSubmitLine = (newLine: DeclarationLine) => {
    const existingLineIndex = declarationLines.findIndex(
      line => line.kode === newLine.kode,
    );

    if (existingLineIndex >= 0) {
      const updatedLines = [...declarationLines];

      updatedLines[existingLineIndex] = newLine;

      setDeclarationLines(updatedLines);
      toast('Line updated successfully', ToastTypes.SUCCESS);
    } else {
      setDeclarationLines(prevLines => [newLine, ...prevLines]);
      toast('Line added successfully', ToastTypes.SUCCESS);
    }
  };

  const handleSubmit = () => {
    mutate(
      {
        sesId: declaration?.sesId ?? '',
        apuId: user?.apuId!,
        lines: declarationLines,
      },
      {
        onSuccess: (declarations: Declaration[]) => {
          declarationSubmittedSheetRef.current?.present(declarations[0]);
        },
        onError: error => {
          toast(
            `Error submitting declaration: ${error.message}`,
            ToastTypes.ERROR,
          );
        },
      },
    );
  };

  const handleItemPress = React.useCallback((item: DeclarationLine) => {
    addLineSheetRef.current?.present({
      procedure: item.kode || item.tekst,
      unitPrice: item.bedrag,
      amount: item.aantal,
    });
  }, []);

  const handleDeleteLine = React.useCallback(
    (line: DeclarationLine) => {
      Alert.alert(
        `Are you sure you want to delete ${line.tekst}?`,
        'This will delete the line permanently.',
        [
          {
            text: 'delete',
            style: 'destructive',
            onPress: () => {
              setDeclarationLines(prevLines =>
                prevLines.filter(item => item.kode !== line.kode),
              );
              toast('Line deleted successfully', ToastTypes.SUCCESS);
            },
          },
          {
            text: 'Cancel',
            onPress: () => null,
          },
        ],
      );
    },
    [setDeclarationLines, toast],
  );

  const totalDeclared =
    declarationLines?.reduce(
      (acc, line) => acc + (line.bedrag * (line?.aantal || 0) || 0),
      0,
    ) ?? 0;

  const declarationAmount = declaration?.bedrag ?? 0;
  const paid = totalDeclared;
  const leftToPay = declarationAmount - paid;
  const hasOverflown = leftToPay < 0;
  const isBelowExpected =
    totalDeclared > 0 && leftToPay > 0 && totalDeclared < declarationAmount;

  const renderEmptyList = React.useCallback(() => {
    return <EmptyList isLoading={isPending} />;
  }, [isPending]);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <PhotoModal
        isVisible={isPhotoModalVisible}
        onClose={() => setIsPhotoModalVisible(false)}
        photoUrl={declaration?.foto ?? ''}
      />
      <BottomSheetModalProvider>
        <LinearGradient
          colors={LINEAR_BACKGROUND_COLORS}
          locations={LINEAR_BACKGROUND_LOCATIONS}
          style={styles.linearGradient}>
          <SafeAreaView style={styles.flex}>
            {isFetchingDeclaration ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            ) : (
              <>
                <View style={styles.topBarContainer}>
                  <View style={styles.innerHeaderContainer}>
                    <Button
                      variant="transparent"
                      text=""
                      style={{minWidth: 0, padding: 10, paddingLeft: 0}}
                      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                      customTextComponent={
                        <FontAwesomeIcon
                          icon={faChevronLeft}
                          size={20}
                          color="white"
                        />
                      }
                      onPress={() => {
                        navigation.dispatch(StackActions.pop(2));
                      }}
                    />
                    <Typography
                      color="white"
                      variant="h3"
                      text={`Declaration ${moment(declaration?.datum).format(
                        'DD MMM YYYY',
                      )}`}
                    />
                  </View>
                  <DeclarationImageButton
                    onPress={() => {
                      setIsPhotoModalVisible(true);
                    }}
                  />
                </View>
                <Typography
                  variant="b2"
                  color="rgba(255, 255, 255, 0.47)"
                  text={
                    hasOverflown ? 'Total exceeded by' : 'Left to be declared'
                  }
                  fontWeight="500"
                />
                <Typography
                  variant="h2"
                  color={hasOverflown ? '#940606' : 'white'}
                  text={formatCurrency(leftToPay)}
                  fontWeight="600"
                  fontSize={38}
                />
                <View style={styles.targetAmountContainer}>
                  {hasOverflown && (
                    <FontAwesomeIcon
                      icon={faWaringSolid}
                      size={15}
                      color="#FFF01A"
                    />
                  )}
                  <Typography
                    variant="h5"
                    fontWeight="500"
                    color="white"
                    text={`Target amount: ${formatCurrency(
                      declaration?.bedrag ?? 0,
                    )}`}
                  />
                </View>
                <View style={styles.detailsContainer}>
                  <Typography
                    variant="h2"
                    color="white"
                    text="Details"
                    fontWeight="300"
                    textStyle={{marginBottom: 10}}
                  />
                  <View style={styles.detailItemRow}>
                    <View style={styles.detailItemContainer}>
                      <Typography
                        variant="h6"
                        text="Date"
                        textStyle={styles.detailsTitle}
                      />
                      <Typography
                        variant="h4"
                        color="white"
                        text={moment(declaration?.datum).format('DD MMM YYYY')}
                      />
                    </View>
                    <View style={styles.detailItemContainer}>
                      <Typography
                        variant="h6"
                        text="Department"
                        textStyle={styles.detailsTitle}
                      />
                      <Typography
                        variant="h4"
                        color="white"
                        text={declaration?.vkcNaam}
                      />
                    </View>
                  </View>
                  <View style={[styles.detailItemRow, {marginTop: 5}]}>
                    <View style={styles.detailItemContainer}>
                      <Typography
                        variant="h6"
                        text="Provider"
                        textStyle={styles.detailsTitle}
                      />
                      <Typography
                        variant="h4"
                        color="white"
                        text={declaration?.artNaam}
                      />
                    </View>
                    <View style={styles.detailItemContainer}>
                      <Typography
                        variant="h6"
                        text="Declaratie Id"
                        textStyle={styles.detailsTitle}
                      />
                      <Typography
                        variant="h4"
                        color="white"
                        text={String(declaration?.nummer)}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.hr} />
                <Typography
                  variant="h2"
                  color="white"
                  text="Declaration lines"
                  fontWeight="300"
                  textStyle={styles.declarationLinesTitle}
                />

                <View style={styles.flex}>
                  <View style={{flex: 0.9}}>
                    <FlatList
                      data={declarationLines}
                      ListEmptyComponent={renderEmptyList}
                      renderItem={props => (
                        <DeclarationLineItem
                          {...props}
                          onPress={handleItemPress}
                          onLongPress={handleDeleteLine}
                          formatCurrency={formatCurrency}
                          canEdit={canEdit}
                        />
                      )}
                      contentContainerStyle={styles.flatlistContentContainer}
                      keyExtractor={keyExtractor}
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      variant="secondary"
                      text="Add line"
                      // @ts-ignore
                      buttonStyle={[
                        styles.addLineButton,
                        !canEdit && styles.addLineButtonDisabled,
                      ]}
                      onPress={handlePresentModalPress}
                      disabled={!canEdit}
                    />
                    <Button
                      variant="primary"
                      text="Submit declaration"
                      disabled={
                        isPending ||
                        declarationLines.length === 0 ||
                        hasOverflown ||
                        isBelowExpected ||
                        !canEdit
                      }
                      buttonStyle={styles.flex}
                      loading={isPending}
                      onPress={handleSubmit}
                    />
                  </View>
                  {isBelowExpected && (
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        marginTop: 10,
                        alignItems: 'center',
                      }}>
                      <FontAwesomeIcon
                        icon={faWarning}
                        size={20}
                        color="#FF8F00"
                        style={{marginTop: 10, marginBottom: 5}}
                      />

                      <Typography
                        variant="b1"
                        fontSize={12}
                        text={
                          'Total declared amount is below the expected amount.'
                        }
                        color="black"
                        fontStyle="italic"
                        textStyle={{marginTop: 5}}
                      />
                    </View>
                  )}
                </View>
              </>
            )}
          </SafeAreaView>
        </LinearGradient>
        <AddDeclarationLineSheet
          ref={addLineSheetRef}
          apuId={user?.apuId!}
          declaration={declaration}
          onSubmit={handleSubmitLine}
          currencyFormatter={formatCurrency}
        />
        <DeclarationSubmittedSheet
          ref={declarationSubmittedSheetRef}
          currencyFormatter={formatCurrency}
        />
        <ActionRequiredSheet ref={actionRequiredSheetRef} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const createStyle = (theme: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5,
      padding: 20,
    },
    innerHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    buttonText: {
      fontSize: 18,
      fontFamily: 'Gill Sans',
      textAlign: 'center',
      margin: 10,
      color: '#ffffff',
      backgroundColor: 'transparent',
    },
    topBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 20,
    },
    detailsContainer: {
      marginTop: 25,
    },
    detailItemRow: {
      flexDirection: 'row',
    },
    detailItemContainer: {
      flex: 1,
    },
    detailsTitle: {
      fontSize: 10,
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.63)',
    },
    hr: {
      backgroundColor: 'rgba(255, 255, 255, 0.09)',
      width: '100%',
      height: 3,
      marginVertical: 20,
    },
    declarationLinesTitle: {
      marginBottom: 15,
    },
    flatlistContentContainer: {
      gap: 15,
      paddingBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 5,
    },
    addLineButton: {
      flex: 1,
      backgroundColor: 'transparent',
      borderColor: theme.colors.primary,
      borderWidth: 2,
      borderStyle: 'dashed',
    },
    addLineButtonDisabled: {
      opacity: 0.5,
    },
    declarationLineItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(80, 50, 159, 0.10)',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 10,
      width: '100%',
    },
    deleteButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      padding: 6,
      backgroundColor: 'rgba(255, 0, 0, 0.7)',
      borderRadius: 20,
    },
    relativeContainer: {
      position: 'relative',
    },
    targetAmountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
  });

export default DeclarationScreen;
