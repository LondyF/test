import React from 'react';
import {
  ActivityIndicator,
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

import {RouteProp, useNavigation} from '@react-navigation/native';
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
import {Declaration, DeclarationLine} from '../types/declarations';
import useToast from '@src/components/Toast/useToast';
import {ToastTypes} from '@src/components/Toast/toastTypes';
import useAddDeclarationLines from '../hooks/useAddDeclarationLines';
import {faChevronLeft} from '@fortawesome/pro-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faWarning} from '@fortawesome/pro-light-svg-icons';

const LINEAR_BACKGROUND_COLORS = ['#50329F', '#8F76CF', '#AE98E7', '#FFFFFF'];
const LINEAR_BACKGROUND_LOCATIONS = [0, 0.17, 0.31, 1];

const currency = 'XCG';

const formatCurrency = (amount: number) => {
  return Number(amount).toLocaleString('nl-NL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
};

const DeclarationLineItem = ({item}: {item: DeclarationLine}) => {
  const {tekst, bedrag, aantal: aantalFromItem} = item;

  const theme = useTheme();

  const aantal = aantalFromItem ?? 1;
  const total = aantal * bedrag;

  const styles = createStyle(theme);

  return (
    <TouchableOpacity style={styles.declarationLineItem}>
      <View style={styles.relativeContainer}>
        {/* Main content */}
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

        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={() => null}>
          <Ionicons name="trash" size={20} color="white" />
        </TouchableOpacity>
      </View>
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
  const {data: declaration} = useFetchDeclaration(user?.apuId!, sesId);

  const {mutate, isPending} = useAddDeclarationLines();

  const [isPhotoModalVisible, setIsPhotoModalVisible] = React.useState(false);
  const [declarationLines, setDeclarationLines] = React.useState<
    DeclarationLine[]
  >(declaration?.regels ?? []);

  React.useEffect(() => {
    if (declaration?.regels) {
      setDeclarationLines(declaration.regels);
    }
  }, [declaration?.regels]);

  const addLineSheetRef = React.useRef<AddDeclarationLineSheetRef>(null);
  const declarationSubmittedSheetRef =
    React.useRef<DeclarationSubmittedSheetRef>(null);

  // callbacks
  const handlePresentModalPress = React.useCallback(() => {
    addLineSheetRef.current?.present();
  }, []);

  const styles = createStyle(theme);

  const keyExtractor = React.useCallback(
    (_: unknown, index: number) => `declaration-${index}`,
    [],
  );

  const handleAddLine = (newLine: DeclarationLine) => {
    setDeclarationLines(prevLines => [newLine, ...prevLines]);

    toast('Line added successfully', ToastTypes.SUCCESS);
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
          console.log(declaration, 'declaration after submit');
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

  const totalDeclared =
    declarationLines?.reduce(
      (acc, line) => acc + (line.bedrag * (line.aantal ?? 0) ?? 0),
      0,
    ) ?? 0;

  const declarationAmount = declaration?.bedrag ?? 0;
  const paid = totalDeclared;
  const leftToPay = declarationAmount - paid;
  const hasOverflown = leftToPay < 0;

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
                    navigation.goBack();
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
              variant="h5"
              fontWeight="500"
              color="white"
              text={`Total: ${formatCurrency(declaration?.bedrag ?? 0)}`}
            />
            <Typography
              variant="h1"
              color="white"
              text={formatCurrency(leftToPay)}
              fontWeight="600"
              fontSize={50}
            />
            <Typography
              variant="b2"
              color="rgba(255, 255, 255, 0.47)"
              text="Left to be declared"
              fontWeight="500"
            />
            {/* <AmountProgressBar
              currentAmount={declaration?.betaald ?? 0}
              totalAmount={declaration?.bedrag ?? 0}
            /> */}
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
                  renderItem={props => <DeclarationLineItem {...props} />}
                  contentContainerStyle={styles.flatlistContentContainer}
                  keyExtractor={keyExtractor}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  variant="secondary"
                  text="Add line"
                  buttonStyle={styles.addLineButton}
                  onPress={handlePresentModalPress}
                />
                <Button
                  variant="primary"
                  text="Submit declaration"
                  disabled={isPending || declarationLines.length === 0}
                  buttonStyle={styles.flex}
                  loading={isPending}
                  onPress={handleSubmit}
                />
              </View>
              {hasOverflown && (
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
                    text="Declartion lines have exceeded the total amount of the declaration."
                    color="black"
                    fontStyle="italic"
                    textStyle={{marginTop: 5}}
                  />
                </View>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>
        <AddDeclarationLineSheet
          ref={addLineSheetRef}
          apuId={user?.apuId!}
          declaration={declaration}
          onSubmit={handleAddLine}
          currencyFormatter={formatCurrency}
        />
        <DeclarationSubmittedSheet
          ref={declarationSubmittedSheetRef}
          currencyFormatter={formatCurrency}
        />
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
  });

export default DeclarationScreen;
