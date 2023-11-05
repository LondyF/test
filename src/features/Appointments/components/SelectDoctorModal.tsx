import React from 'react';
import {StyleSheet, View} from 'react-native';

import {faHospital, faUserNurse} from '@fortawesome/pro-solid-svg-icons';
import {Item} from 'react-native-picker-select';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';

import useTheme from '@hooks/useTheme';
import {Button, Loader, SelectInput, Typography} from '@src/components';
import {Theme} from '@src/styles/styles';

interface SelectDoctorModalProps {
  isVisible: boolean;
  selectedDoctorEstablishmentId: number;
  selectedDoctorId: number;
  nextButtonStepPressed: () => void;
  cancelButtonPressed: () => void;
  setSelectedDoctorId: React.Dispatch<React.SetStateAction<number>>;
  setSelectedDoctorEstablishmentId: React.Dispatch<
    React.SetStateAction<number>
  >;
  availabeDoctorItems: Item[];
  availabeDoctorEstablishmentsItems: Item[];
  isFetchingAvailabeDoctors: boolean;
}

const SelectDoctorModal: React.FC<SelectDoctorModalProps> = ({
  isVisible,
  nextButtonStepPressed,
  cancelButtonPressed,
  setSelectedDoctorId,
  setSelectedDoctorEstablishmentId,
  selectedDoctorEstablishmentId,
  availabeDoctorEstablishmentsItems,
  availabeDoctorItems,
  selectedDoctorId,
  isFetchingAvailabeDoctors,
}) => {
  const {t} = useTranslation();
  const theme = useTheme();

  let loadedSelectItems =
    availabeDoctorEstablishmentsItems?.length >= 1 &&
    availabeDoctorItems?.length >= 1;

  let areDoctorsAvailable =
    loadedSelectItems && availabeDoctorItems[0].value !== -999;
  let areDoctorsEstablishmentsAvailable =
    loadedSelectItems && availabeDoctorEstablishmentsItems[0].value !== -999;

  let showError = !(areDoctorsEstablishmentsAvailable && areDoctorsAvailable);

  const styles = makeStyles(theme);

  const renderContent = () => {
    if (!loadedSelectItems || isFetchingAvailabeDoctors) {
      return (
        <Loader
          text={t('common.loading')}
          textColor={theme.colors.primary}
          indicatorColor={theme.colors.primary}
        />
      );
    }

    if (showError) {
      return (
        <>
          <Typography
            text={t('appointments.noSelektiesVesArtsAlinea1')}
            align="center"
            textStyle={styles.alinea}
            variant="b1"
          />
          <Typography
            text={t('appointments.noSelektiesVesArtsAlinea2')}
            align="center"
            textStyle={styles.alinea}
            variant="b1"
          />
          <Typography
            text={t('appointments.noSelektiesVesArtsAlinea3')}
            align="center"
            textStyle={styles.alinea}
            variant="b1"
          />

          <Button
            buttonStyle={styles.continueButton}
            onPress={cancelButtonPressed}
            text={t('common.back')}
          />
        </>
      );
    } else {
      return renderSelectInputs();
    }
  };

  const renderSelectInputs = () => {
    return (
      <>
        <Typography
          text={t('bookAppointment.chooseYourDoctor')}
          variant="h1"
          fontWeight="bold"
          textStyle={styles.contentTitle}
        />
        {!loadedSelectItems || isFetchingAvailabeDoctors ? (
          <Loader
            text={t('common.loading')}
            textColor={theme.colors.primary}
            indicatorColor={theme.colors.primary}
          />
        ) : (
          <>
            <SelectInput
              label={t('bookAppointment.establishment')}
              labelStyle={styles.blackColor}
              bottomBorderStyle={styles.selectInputBorder}
              onValueChange={value => {
                setSelectedDoctorEstablishmentId(value);
              }}
              value={selectedDoctorEstablishmentId}
              items={availabeDoctorEstablishmentsItems}
              icon={faHospital}
              iconStyle={styles.blackColor}
            />
            <SelectInput
              label={t('bookAppointment.doctor')}
              labelStyle={styles.blackColor}
              bottomBorderStyle={styles.selectInputBorder}
              onValueChange={value => setSelectedDoctorId(value)}
              items={availabeDoctorItems}
              value={selectedDoctorId}
              icon={faUserNurse}
              iconStyle={styles.blackColor}
            />
            <View style={styles.buttonsContainer}>
              <Button
                buttonStyle={styles.cancelButton}
                variant="outline"
                textStyle={styles.cancelButtonText}
                onPress={cancelButtonPressed}
                text={t('common.cancel')}
              />
              <Button
                buttonStyle={styles.continueButton}
                disabled={
                  !(areDoctorsAvailable && areDoctorsEstablishmentsAvailable)
                }
                onPress={nextButtonStepPressed}
                text={t('bookAppointment.next')}
              />
            </View>
          </>
        )}
      </>
    );
  };

  return (
    <Modal
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={0}
      useNativeDriver
      isVisible={isVisible}>
      <View style={styles.modalContent}>{renderContent()}</View>
    </Modal>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    alinea: {
      marginBottom: 10,
    },
    contentTitle: {
      fontSize: 20,
      marginBottom: 12,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 22,
      minHeight: 270,
      justifyContent: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    blackColor: {
      color: 'black',
    },
    selectInputBorder: {
      borderBottomColor: 'black',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cancelButton: {
      borderColor: theme.colors.primary,
      flex: 0.48,
    },
    cancelButtonText: {
      color: theme.colors.primary,
    },
    continueButton: {
      borderColor: theme.colors.primary,
      flex: 0.48,
    },
  });

export default SelectDoctorModal;
