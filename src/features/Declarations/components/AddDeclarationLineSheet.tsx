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
import {Button, SelectInput, TextInput, Typography} from '@src/components';
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

export type AddDeclarationLineSheetRef = {
  present: () => void;
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
  procedureOptions: {label: string; value: number}[];
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
}) => {
  const styles = createStyles(insets);
  const {shouldHandleKeyboardEvents} = useBottomSheetInternal();

  const activeIndex = React.useMemo(
    () =>
      procedureOptions.findIndex(option => option.value === values.procedure),
    [procedureOptions, values.procedure],
  );

  return (
    <BottomSheetView style={styles.sheet}>
      <Typography
        variant="h3"
        text="Add new invoice line"
        fontWeight="300"
        textStyle={styles.title}
      />
      <Dropdown
        search
        value={values.procedure}
        autoScroll={false}
        data={procedureOptions}
        labelField="label"
        valueField="value"
        onChange={value => setFieldValue('procedure', value.value)}
        style={styles.selectInputBorder}
        maxHeight={250}
        searchPlaceholder="Search..."
        flatListProps={{
          initialScrollIndex: activeIndex >= 0 ? activeIndex : 0,
        }}
        renderLeftIcon={() => (
          <View style={{marginRight: 10}}>
            {isLoadingProcedures ? (
              <ActivityIndicator size="small" color={styles.selectIcon.color} />
            ) : (
              <FontAwesomeIcon
                icon={faFileInvoiceDollar}
                style={styles.selectIcon}
              />
            )}
          </View>
        )}
      />
      {errors.procedure && (
        <Typography
          variant="b1"
          text={errors.procedure}
          color="red"
          textStyle={{marginTop: 5}}
        />
      )}
      <TextInput
        label="Unit price"
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
        label="Amount"
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
        text="Please note that the amount will be multiplied by the unit price."
        fontStyle="italic"
        fontSize={10}
        textStyle={{marginTop: 10, marginBottom: 20}}
      />

      <Typography
        variant="b1"
        fontWeight="bold"
        text={`Total: ${currencyFormatter(total)}`}
        textStyle={{marginBottom: 10}}
      />

      <Button
        variant="primary"
        text="Add line"
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

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  React.useImperativeHandle(ref, () => ({
    present: () => bottomSheetModalRef.current?.present(),
    dismiss: () => bottomSheetModalRef.current?.dismiss(),
  }));

  const {data: procedures, isPending} = useFetchProcedures({
    apuId,
    sqArtId: declaration?.sqArtId ?? -1,
    vkcId: declaration?.vkcId ?? -1,
  });

  const {values, errors, setFieldValue, handleChange, resetForm, handleSubmit} =
    useFormik<NewLineValues>({
      validateOnChange: false,
      validationSchema: Yup.object().shape({
        procedure: Yup.number().required('Procedure is required'),
        unitPrice: Yup.number()
          .typeError('Unit price must be a number')
          .required('Unit price is required')
          .positive('Unit price must be a positive number'),
        amount: Yup.number()
          .required('Amount is required')
          .positive('Amount must be a positive number'),
      }),
      initialValues: {
        procedure: undefined,
        unitPrice: undefined,
        amount: 1,
      },
      onSubmit: submittedValues => {
        const procedure = procedures?.find(
          prcd => prcd.id === Number(submittedValues.procedure),
        );
        onSubmit({
          aantal: submittedValues.amount,
          bedrag: Number(submittedValues.unitPrice! * submittedValues.amount),
          betaald: null,
          kode: procedure?.kode || '',
          tekst: procedure?.naam || '',
          naam: procedure?.naam || '',
        });

        resetForm();
        bottomSheetModalRef.current?.dismiss();
      },
    });

  const procedureOptions =
    procedures?.map(procedure => ({
      label: procedure.naam,
      value: procedure.id,
    })) || [];

  const total = values.unitPrice ? values.unitPrice * (values.amount || 0) : 0;

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onDismiss={() => resetForm()}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={BottomSheetBackdrop}>
      <Content
        insets={insets}
        procedureOptions={procedureOptions}
        isPending={isPending}
        values={values}
        errors={errors}
        setFieldValue={setFieldValue}
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
