import React from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {Platform, StyleSheet, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

import {Button, Typography} from '@src/components';
import {Declaration, DeclarationStatus} from '../types/declarations';
import moment from 'moment';
import StepIndicator from './StepIndicator';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import DashedSvgLine from './DashedSvgLine';
import DeclarationSuccessIcon from './DeclarationSuccessIcon';
import DeclarationLineItem from './DeclarationLineItem';
import {currencyFormatter as currenyFormatterFn} from '../utils';
import useTheme from '@src/hooks/useTheme';

export type DeclarationCompletedSheetRef = {
  present: (declaration: Declaration) => void;
  dismiss: () => void;
};

type DeclarationCompletedSheetProps = {
  currencyFormatter: (value: number) => string;
};

const DeclarationCompletedSheet = React.forwardRef<
  DeclarationCompletedSheetRef,
  DeclarationCompletedSheetProps
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
  const {t} = useTranslation();
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

  const isFullyPaid = declaration?.bedrag === declaration?.betaald;

  const formatInPaidCurrency = currenyFormatterFn(
    declaration?.kurensieBetaling ?? declaration?.kurensie ?? 'XCG',
  );

  const theme = useTheme();

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      enableDynamicSizing={true}
      handleComponent={DeclarationSuccessIcon}
      backdropComponent={BackdropComponent}>
      <BottomSheetView style={styles.sheet}>
        <Typography
          variant="h3"
          fontWeight="bold"
          text={
            isFullyPaid
              ? t('declarations.declarationPaid')
              : t('declarations.declarationPartiallyPaid')
          }
          textStyle={{textAlign: 'center'}}
        />
        <Typography
          variant="h4"
          text={t('declarations.declaredAmountPaidAmount')}
          textStyle={{textAlign: 'center', marginTop: 20, marginBottom: 10}}
          color="#929191"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Typography
            variant="h4"
            fontWeight="600"
            text={currencyFormatter?.(declaration?.bedrag ?? 0)}
            textStyle={{textAlign: 'center'}}
          />
          <Typography
            variant="h3"
            fontWeight="600"
            text="/  "
            textStyle={{textAlign: 'center'}}
          />
          <Typography
            variant="h3"
            fontWeight="bold"
            text={formatInPaidCurrency?.(declaration?.betaald ?? 0)}
            textStyle={{textAlign: 'center'}}
            color={theme.colors.primary}
          />
        </View>
        <DashedSvgLine style={{marginVertical: 25}} />
        <View style={{gap: 15}}>
          <View style={styles.infoContainer}>
            <Typography
              variant="h5"
              text={t('declarations.department')}
              color="#585858"
            />
            <Typography
              variant="h4"
              text={declaration?.vkcNaam}
              fontWeight="500"
            />
          </View>
          <View style={styles.infoContainer}>
            <Typography
              variant="h5"
              text={t('declarations.provider')}
              color="#585858"
            />
            <Typography
              variant="h4"
              text={declaration?.artNaam}
              fontWeight="500"
            />
          </View>
          <View style={styles.infoContainer}>
            <Typography
              variant="h5"
              text={t('declarations.date')}
              color="#585858"
            />
            <Typography
              variant="h4"
              text={moment(declaration?.datum).format('DD MMM YYYY')}
              fontWeight="500"
            />
          </View>
          <View style={styles.infoContainer}>
            <Typography
              variant="h5"
              text={t('declarations.declarationId')}
              color="#585858"
            />
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
              currencyFormatter={formatInPaidCurrency}
              additionalInfo={props.item.info}
              item={{
                ...props.item,
                bedrag: props.item.betaald ?? 0,
              }}
            />
          )}
        />
        <DashedSvgLine style={{marginTop: 0, marginBottom: 10}} />
        <StepIndicator
          style={{marginBottom: 10}}
          currentStep={declaration?.progressId ?? (0 as DeclarationStatus)}
        />
        <Button
          variant="primary"
          text={t('common.close')}
          onPress={handleClose}
          buttonStyle={{
            marginBottom: Platform.OS === 'ios' ? 0 : 10,
          }}
        />
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
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

export default DeclarationCompletedSheet;
