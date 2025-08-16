import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {
  BottomSheetBackdrop as BottomSheetBackdropComponent,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetInternal,
} from '@gorhom/bottom-sheet';

import * as Yup from 'yup';
import {Button, TextInput, Typography} from '@src/components';
import {faFileInvoiceDollar, faReceipt} from '@fortawesome/pro-solid-svg-icons';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  Declaration,
  DeclarationLine,
} from '@src/features/Declarations/types/declarations';
import useFetchProcedures from '../hooks/useFetchProcedures';
import {useFormik} from 'formik';
import {Dropdown} from 'react-native-element-dropdown';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useTranslation} from 'react-i18next';

const BottomSheetBackdrop = (props: BottomSheetBackdropProps) => {
  const styles = createStyles();

  return (
    <BottomSheetBackdropComponent
      {...props}
      opacity={0.5}
      enableTouchThrough={false}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={styles.bottomsheetBackdrop}
    />
  );
};

type PresentInput = {
  procedure: string;
  amount: number;
  unitPrice: number;
};

export type AddDeclarationLineSheetRef = {
  present: (input?: PresentInput) => void;
  dismiss: () => void;
};

type NewLineValues = {
  procedure?: string;
  amount: number;
  unitPrice?: number;
};

type AddDeclarationLineSheetProps = {
  apuId: number;
  declaration?: Declaration;
  onSubmit: (values: DeclarationLine) => void;
  currencyFormatter: (value: number) => string;
};

type ContentProps = {
  insets: EdgeInsets;
  procedureOptions: {label: string; value: string}[];
  isPending: boolean;
  values: NewLineValues;
  errors: Partial<Record<keyof NewLineValues, string>>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean,
  ) => Promise<void | any>;
  handleChange: (field: string) => (text: string) => void;
  handleSubmit: () => void;
  currencyFormatter: (value: number) => string;
  total: number;
  isEditingExistingLine: boolean;
  isFreeTextDeclaration: boolean;
};

const Content: React.FC<ContentProps> = ({
  insets,
  procedureOptions,
  isPending: isLoadingProcedures,
  values,
  errors,
  setFieldValue,
  handleChange,
  handleSubmit,
  currencyFormatter,
  total,
  isEditingExistingLine,
  isFreeTextDeclaration,
}) => {
  const styles = createStyles(insets);
  const {shouldHandleKeyboardEvents} = useBottomSheetInternal();

  const {t} = useTranslation();

  const activeIndex = React.useMemo(
    () =>
      procedureOptions.findIndex(option => option.value === values.procedure),
    [procedureOptions, values.procedure],
  );

  return (
    <BottomSheetView style={styles.sheet}>
      <Typography
        variant="h3"
        text={
          isEditingExistingLine
            ? t('declarations.updateDeclarationLine')
            : t('declarations.addNewDeclarationLine')
        }
        fontWeight="300"
        textStyle={!isFreeTextDeclaration ? styles.title : {}}
      />
      {isFreeTextDeclaration ? (
        <TextInput
          label={t('declarations.procedure')}
          mainColor="black"
          icon={faFileInvoiceDollar}
          autoCapitalize="none"
          value={values.procedure}
          onChangeText={handleChange('procedure')}
          error={errors.procedure}
          disabled={isEditingExistingLine}
          style={isEditingExistingLine && {opacity: 0.5}}
        />
      ) : (
        <Dropdown
          search
          value={values.procedure}
          autoScroll={false}
          disable={isEditingExistingLine}
          dropdownPosition="top"
          data={procedureOptions}
          labelField="label"
          valueField="value"
          onChange={value => setFieldValue('procedure', value.value)}
          containerStyle={{borderWidth: 2, borderColor: '#d2d2d2'}}
          style={[
            styles.selectInputBorder,
            isEditingExistingLine && {opacity: 0.5},
          ]}
          maxHeight={250}
          searchPlaceholder="Search..."
          itemContainerStyle={{
            borderBottomColor: '#d2d2d2',
            borderBottomWidth: 1,
          }}
          flatListProps={{
            initialScrollIndex: activeIndex >= 0 ? activeIndex : 0,
          }}
          renderLeftIcon={() => (
            <View style={{marginRight: 10}}>
              {isLoadingProcedures ? (
                <ActivityIndicator
                  size="small"
                  color={styles.selectIcon.color}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faFileInvoiceDollar}
                  style={styles.selectIcon}
                />
              )}
            </View>
          )}
        />
      )}
      {errors.procedure && (
        <Typography
          variant="b1"
          text={errors.procedure}
          color="red"
          textStyle={{marginTop: 5}}
        />
      )}
      <TextInput
        label={t('declarations.unitPrice')}
        mainColor="black"
        icon={faReceipt}
        autoCapitalize="none"
        keyboardType="numeric"
        value={values.unitPrice ? String(values.unitPrice) : ''}
        onChangeText={handleChange('unitPrice')}
        error={errors.unitPrice}
        onFocus={() => {
          shouldHandleKeyboardEvents.value = true;
        }}
        onBlur={() => {
          shouldHandleKeyboardEvents.value = false;
        }}
      />
      <TextInput
        label={t('declarations.amount')}
        mainColor="black"
        icon={faReceipt}
        autoCapitalize="none"
        keyboardType="numeric"
        value={values.amount ? String(values.amount) : ''}
        onChangeText={handleChange('amount')}
        error={errors.amount}
      />

      <Typography
        variant="b1"
        text={t('declarations.noteAmountMultipliedByUnitPrice')}
        fontStyle="italic"
        fontSize={10}
        textStyle={{marginTop: 10, marginBottom: 20}}
      />

      <Typography
        variant="b1"
        fontWeight="bold"
        text={`${t('declarations.total')}: ${currencyFormatter(total)}`}
        textStyle={{marginBottom: 10}}
      />

      <Button
        variant="primary"
        text={
          isEditingExistingLine
            ? t('declarations.updateLine')
            : t('declarations.addLine')
        }
        onPress={() => handleSubmit()}
        buttonStyle={styles.addLineButton}
      />
    </BottomSheetView>
  );
};

const AddDeclarationLineSheet = React.forwardRef<
  AddDeclarationLineSheetRef,
  AddDeclarationLineSheetProps
>(({apuId, declaration, currencyFormatter, onSubmit}, ref) => {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const [isEditingExistingLine, setIsEditingExistingLine] =
    React.useState<boolean>(false);

  React.useImperativeHandle(ref, () => ({
    present: options => {
      if (options) {
        setFieldValue('procedure', options.procedure);
        setFieldValue('amount', options.amount || 1);
        setFieldValue('unitPrice', options.unitPrice);

        setIsEditingExistingLine(true);
      }

      bottomSheetModalRef.current?.present();
    },
    dismiss: () => bottomSheetModalRef.current?.dismiss(),
  }));

  const {data: procedures, isPending} = useFetchProcedures({
    apuId,
    sqArtId: declaration?.sqArtId ?? -1,
    vkcId: declaration?.vkcId ?? -1,
  });

  const isFreeTextDeclaration = declaration?.freeTxt === 1;

  const {values, errors, setFieldValue, handleChange, resetForm, handleSubmit} =
    useFormik<NewLineValues>({
      validateOnChange: false,
      validationSchema: Yup.object().shape({
        procedure: Yup.string().required(t('validators.requiredField')),
        unitPrice: Yup.number()
          .typeError(t('validators.onlyNumbers'))
          .required(t('validators.requiredField'))
          .positive(t('validators.onlyNumbers')),
        amount: Yup.number()
          .required(t('validators.requiredField'))
          .positive(t('validators.onlyNumbers')),
      }),
      initialValues: {
        procedure: undefined,
        unitPrice: undefined,
        amount: 1,
      },
      onSubmit: submittedValues => {
        const procedure = isFreeTextDeclaration
          ? {
              naam: submittedValues.procedure,
              kode: submittedValues.procedure,
            }
          : procedures?.find(prcd => prcd.kode === submittedValues.procedure);

        onSubmit({
          aantal: submittedValues.amount,
          bedrag: submittedValues.unitPrice || 0,
          betaald: null,
          kode: procedure?.kode || '',
          tekst: procedure?.naam || '',
          // @ts-ignore: backend issue
          naam: procedure?.naam || '',
        });

        resetForm();
        bottomSheetModalRef.current?.dismiss();
      },
    });

  const procedureOptions =
    procedures?.map(procedure => ({
      label: procedure.naam,
      value: procedure.kode,
    })) || [];

  const total = values.unitPrice ? values.unitPrice * (values.amount || 0) : 0;

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onDismiss={() => {
        resetForm();
        setIsEditingExistingLine(false);
      }}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={BottomSheetBackdrop}>
      <Content
        isEditingExistingLine={isEditingExistingLine}
        isFreeTextDeclaration={isFreeTextDeclaration}
        insets={insets}
        procedureOptions={procedureOptions}
        isPending={isPending}
        values={values}
        errors={errors}
        setFieldValue={setFieldValue}
        // @ts-ignore
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        currencyFormatter={currencyFormatter}
        total={total}
      />
    </BottomSheetModal>
  );
});

const createStyles = (insets?: EdgeInsets) =>
  StyleSheet.create({
    sheet: {
      paddingHorizontal: 20,
      paddingBottom: insets?.bottom || 20,
    },
    bottomsheetBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    title: {
      marginBottom: 20,
    },
    selectInputBorder: {
      borderBottomColor: 'black',
      borderBottomWidth: 2,
      paddingBottom: 10,
    },
    selectLabel: {
      color: 'black',
      fontWeight: 'normal',
    },
    selectIcon: {
      color: 'black',
    },
    addLineButton: {
      marginTop: 20,
    },
  });

export default AddDeclarationLineSheet;
