import React from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleCheck} from '@fortawesome/pro-solid-svg-icons';

import {Button, Typography} from '@src/components';
import useTheme from '@src/hooks/useTheme';
import Svg, {Line} from 'react-native-svg';
import {Declaration, DeclarationLine} from '../types/declarations';
import moment from 'moment';
import StepIndicator from './StepIndicator';
import {StackActions, useNavigation} from '@react-navigation/native';

const DashedSvgLine = ({style}: {style?: StyleProp<ViewStyle>}) => (
  <Svg height="8" width="100%" style={style}>
    <Line
      x1="0"
      y1="5"
      x2="100%"
      y2="5"
      stroke="#DCDCDC"
      strokeWidth="4"
      strokeDasharray="15,10"
    />
  </Svg>
);

const SuccessIcon = () => {
  const theme = useTheme();
  const styles = createStylesWithInsets(useSafeAreaInsets());

  return (
    <View style={styles.successIconContainer}>
      <FontAwesomeIcon
        icon={faCircleCheck}
        size={80}
        color={theme.colors.primary}
      />
    </View>
  );
};

const DeclarationLineItem = ({
  item,
  currencyFormatter,
}: {
  item: DeclarationLine;
  currencyFormatter: (value: number) => string;
}) => {
  const {tekst, bedrag, aantal: aantalFromItem} = item;

  const aantal = aantalFromItem ?? 1;
  const total = aantal * bedrag;

  const styles = createStylesWithInsets(useSafeAreaInsets());

  return (
    <View style={styles.declarationLineItem}>
      <Typography variant="h5" text={aantal + ' x ' + tekst} color="#585858" />
      <Typography
        variant="h5"
        text={currencyFormatter(total)}
        fontWeight="500"
        textStyle={{textAlign: 'center'}}
      />
    </View>
  );
};

export type DeclarationSubmittedSheetRef = {
  present: (declaration: Declaration) => void;
  dismiss: () => void;
};

type DeclarationSubmittedSheetProps = {
  currencyFormatter: (value: number) => string;
};

const DeclarationSubmittedSheet = React.forwardRef<
  DeclarationSubmittedSheetRef,
  DeclarationSubmittedSheetProps
>(({currencyFormatter}, ref) => {
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const [declaration, setDeclaration] = React.useState<Declaration | null>(
    null,
  );

  React.useImperativeHandle(ref, () => ({
    present: submittedDeclaration => {
      bottomSheetModalRef.current?.present();
      setDeclaration(submittedDeclaration);
    },
    dismiss: () => bottomSheetModalRef.current?.dismiss(),
  }));

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const styles = createStylesWithInsets(insets);

  const BackdropComponent = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={() => null}
        style={styles.bottomsheetBackdrop}
      />
    ),
    [styles.bottomsheetBackdrop],
  );

  const handleClose = () => {
    const popAction = StackActions.pop(2);

    navigation.dispatch(popAction);
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      enableDynamicSizing={true}
      handleComponent={SuccessIcon}
      backdropComponent={BackdropComponent}>
      <BottomSheetView style={styles.sheet}>
        <Typography
          variant="h3"
          fontWeight="bold"
          text="Declaration Submitted"
          textStyle={{textAlign: 'center'}}
        />
        <Typography
          variant="h4"
          text="Amout declared"
          textStyle={{textAlign: 'center', marginTop: 20, marginBottom: 10}}
          color="#929191"
        />
        <Typography
          variant="h3"
          fontWeight="bold"
          text={currencyFormatter?.(declaration?.bedrag ?? 0)}
          textStyle={{textAlign: 'center'}}
        />
        <DashedSvgLine style={{marginVertical: 25}} />
        <View style={{gap: 15}}>
          <View style={styles.infoContainer}>
            <Typography variant="h5" text="Department" color="#585858" />
            <Typography
              variant="h4"
              text={declaration?.vkcNaam}
              fontWeight="500"
            />
          </View>
          <View style={styles.infoContainer}>
            <Typography variant="h5" text="Provider" color="#585858" />
            <Typography
              variant="h4"
              text={declaration?.artNaam}
              fontWeight="500"
            />
          </View>
          <View style={styles.infoContainer}>
            <Typography variant="h5" text="Date" color="#585858" />
            <Typography
              variant="h4"
              text={moment(declaration?.datum).format('DD MMM YYYY')}
              fontWeight="500"
            />
          </View>
          <View style={styles.infoContainer}>
            <Typography variant="h5" text="ID" color="#585858" />
            <Typography
              variant="h4"
              text={String(declaration?.nummer)}
              fontWeight="500"
            />
          </View>
        </View>
        <DashedSvgLine style={{marginVertical: 25}} />
        <BottomSheetFlatList
          data={declaration?.regels}
          keyExtractor={(_, index) => index + ''}
          renderItem={props => (
            <DeclarationLineItem
              currencyFormatter={currencyFormatter}
              {...props}
            />
          )}
        />
        <DashedSvgLine style={{marginTop: 0, marginBottom: 10}} />
        <StepIndicator
          style={{marginBottom: 10}}
          currentStep={declaration?.status ?? 0}
        />
        <Button variant="primary" text="Close" onPress={handleClose} />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const createStylesWithInsets = (insets: EdgeInsets) =>
  StyleSheet.create({
    sheet: {
      paddingHorizontal: 20,
      paddingBottom: insets.bottom,
      position: 'relative',
      paddingTop: 60,
    },
    bottomsheetBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    hr: {
      borderBottomStyle: 'dashed',
      borderBottomWidth: 5,
      borderColor: '#DCDCDC',
      width: '100%',
    },
    successIconContainer: {
      width: 110,
      height: 110,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      position: 'absolute',
      borderRadius: 55,
      top: -55,
      alignSelf: 'center',
    },
    declarationLineItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 20,
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

export default DeclarationSubmittedSheet;
