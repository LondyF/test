import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';

import {Item} from 'react-native-picker-select';
import {NavigationProp} from '@react-navigation/core';
import moment from 'moment';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';

import {Button, PageContainer, TextInput, Typography} from '@src/components';
import SelectButtonGroup, {
  SelectButtonGroupItem,
} from '@components/selectButtonGroup';
import {Theme} from '@src/styles';
import useToast from '@components/Toast/useToast';
import {ToastTypes} from '@components/Toast/toastTypes';
import useAuthStore from '@stores/useAuthStore';

import {Spot, AvailableSpotDate} from '../types/spots';
import useFetchAvailableSpots from '../hooks/useFetchAvailableSpots';
import useFetchAvailableDoctorsEstablishments from '../hooks/useFetchAvailableDoctorsEstablishments';
import useBookAppointment from '../hooks/useBookAppointment';
import DoctorCard from '../components/DoctorCard';
import Calendar from '../components/Calendar';
import SelectDoctorModal from '../components/SelectDoctorModal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useQueryClient} from '@tanstack/react-query';

type SortedSpot = Record<string, AvailableSpotDate>;

interface Props {
  navigation: NavigationProp<{}>;
}

const BookAppointmentScreen: React.FC<Props> = ({navigation}) => {
  const user = useAuthStore(state => state.user);
  const Toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: availableDoctorEstablishmentsData,
    isLoading: isLoadingAvailableDoctorEstablishments,
  } = useFetchAvailableDoctorsEstablishments(user?.apuId ?? -1);

  const [showModal, setShowModal] = useState<boolean>(true);
  const [availabledDates, setAvailableDates] = useState<Array<string>>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [spotsSortedByDate, setSpotsSortedByDate] = useState<SortedSpot>({});
  const [availableSpots, setAvailableSpots] = useState<
    Array<SelectButtonGroupItem>
  >([]);
  const [selectedGroupItem, setSelectedGroupItem] = useState<number>(0);
  const [
    availabeDoctorEstablishmentsItems,
    setAvailabeDoctorEstablishmentsItems,
  ] = useState<Item[]>([]);
  const [selectedDoctorEstablishmentId, setSelectedDoctorEstablishmentId] =
    useState<number>(0);
  const [availabeDoctorItems, setAvailabeDoctorItems] = useState<Item[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(0);

  const {
    mutateAsync: bookAppointmentAsync,
    data: bookAppointmentData,
    error: bookAppointmentError,
    isSuccess,
  } = useBookAppointment();
  const {t} = useTranslation();

  const {handleChange, handleSubmit, values, errors} = useFormik({
    initialValues: {
      reason: '',
    },
    onSubmit: bookAppointmentButtonPressed,
    validateOnBlur: false,
    validateOnChange: true,
    validationSchema: Yup.object({
      reason: Yup.string().required(t('validators.requiredField')),
    }),
  });

  const {
    data,
    isLoading: isLoadingAvailableSpots,
    isFetching,
    refetch: fetchAvailableSpots,
  } = useFetchAvailableSpots(
    user?.apuId ?? -1,
    selectedDoctorEstablishmentId,
    selectedDoctorId,
  );

  const getAvailableDoctorEstablishmentsOptions = useCallback(() => {
    if (
      availableDoctorEstablishmentsData &&
      availableDoctorEstablishmentsData.allSpots
    ) {
      return availableDoctorEstablishmentsData.allSpots.map(x => {
        return {
          label: x.naam,
          value: x.vesId,
        };
      });
    }

    return [
      {
        label: t('bookAppointment.noAvailableEstablishments'),
        value: -999,
      },
    ];
  }, [availableDoctorEstablishmentsData, t]);

  const getAvailableDoctorsOptions = useCallback(() => {
    if (
      availableDoctorEstablishmentsData &&
      availableDoctorEstablishmentsData.allSpots
    ) {
      return availableDoctorEstablishmentsData.allSpots
        .find(x => {
          return x.vesId === selectedDoctorEstablishmentId;
        })
        ?.arts.map(x => {
          return {
            label: x.naam,
            value: x.mdwId,
          } as Item;
        });
    }

    return [
      {
        label: t('bookAppointment.noAvailableDoctors'),
        value: -999,
      },
    ];
  }, [availableDoctorEstablishmentsData, selectedDoctorEstablishmentId, t]);

  useEffect(() => {
    if (!isLoadingAvailableDoctorEstablishments) {
      let availableDoctorEstablishments =
        getAvailableDoctorEstablishmentsOptions();
      setAvailabeDoctorEstablishmentsItems(availableDoctorEstablishments);
      setSelectedDoctorEstablishmentId(availableDoctorEstablishments[0].value);
    }
  }, [
    availableDoctorEstablishmentsData,
    getAvailableDoctorEstablishmentsOptions,
    isLoadingAvailableDoctorEstablishments,
  ]);

  useEffect(() => {
    if (!isLoadingAvailableDoctorEstablishments) {
      let availableDoctors = getAvailableDoctorsOptions();
      setAvailabeDoctorItems(availableDoctors!);
      if (availableDoctors && availableDoctors.length > 0) {
        setSelectedDoctorId(availableDoctors![0].value);
      }
    }
  }, [
    availableDoctorEstablishmentsData,
    getAvailableDoctorsOptions,
    selectedDoctorEstablishmentId,
    isLoadingAvailableDoctorEstablishments,
  ]);

  const nextButtonStepPressed = async () => {
    await fetchAvailableSpots();
    setSelectedDate('');
    setShowModal(false);
    setSelectedGroupItem(0);
  };

  const cancelButtonPressed = async () => {
    setShowModal(false);
    navigation.goBack();
  };

  const SortSpotsByDate = useCallback(() => {
    let availableSpotDays = data?.allSpots;
    let sortedSpots = availableSpotDays?.reduce(
      (spots: SortedSpot, spotDay: AvailableSpotDate) => {
        let availableDateString = spotDay.datum.toString().split('T')[0];
        spots[availableDateString] = spotDay;
        return spots;
      },
      {},
    );
    return sortedSpots;
  }, [data]);

  useEffect(() => {
    if (!isLoadingAvailableSpots) {
      const sortedSpots = SortSpotsByDate();

      setSpotsSortedByDate(sortedSpots ?? {});
      setAvailableDates(Object.keys(sortedSpots ?? {}));
    }
  }, [SortSpotsByDate, isLoadingAvailableSpots]);

  useEffect(() => {
    spotsSortedByDate &&
      spotsSortedByDate[selectedDate] &&
      setAvailableSpots(
        spotsSortedByDate[selectedDate].spots.map((x: Spot) => {
          return {
            id: x.r,
            title: x.t,
          };
        }),
      );
  }, [selectedDate, spotsSortedByDate]);

  const onAvailableSpotItemPress = useCallback((id: number) => {
    setSelectedGroupItem(id);
  }, []);

  const onAvailableDayPress = useCallback((date: string) => {
    setSelectedDate(date);
    setSelectedGroupItem(0);
  }, []);

  async function bookAppointmentButtonPressed({reason}: {reason: string}) {
    try {
      const isSpotSelected = selectedDate !== '' && selectedGroupItem !== 0;

      if (!isSpotSelected) {
        return Alert.alert('Error', t('bookAppointment.noSpotSelected'));
      }

      const selectedSpot = spotsSortedByDate[selectedDate].spots.find(
        x => x.r === selectedGroupItem,
      );

      const newAppointment = {
        datum: moment(selectedDate).toISOString(),
        mdwId: selectedSpot?.mI ?? -1,
        timeId: selectedSpot?.tI ?? -1,
        dt: selectedSpot?.ti ?? new Date(),
        vesId: selectedDoctorEstablishmentId,
        reason,
        apuId: user?.apuId ?? -1,
      };

      const {status} = await bookAppointmentAsync(newAppointment, {
        onError: error =>
          Toast(error?.response?.data.status?.msg ?? '', ToastTypes.ERROR),
      });

      Toast(status.msg, ToastTypes.SUCCESS);
      navigation.goBack();
      queryClient.invalidateQueries(['appointments', user?.apuId]);
    } catch (e) {
      console.log(bookAppointmentError);
    }
  }

  let selectedDoctorName = useMemo(
    () =>
      availabeDoctorItems?.find(x => x.value === selectedDoctorId)?.label || '',
    [selectedDoctorId, availabeDoctorItems],
  );

  let selectedDoctorEstablishmentName = useMemo(
    () =>
      availabeDoctorEstablishmentsItems.find(
        x => x.value === selectedDoctorEstablishmentId,
      )?.label,
    [availabeDoctorEstablishmentsItems, selectedDoctorEstablishmentId],
  );

  const renderAvailableSpots = () => {
    return (
      <SelectButtonGroup
        single
        selectedItem={selectedGroupItem}
        onItemPress={onAvailableSpotItemPress}
        items={availableSpots}
      />
    );
  };

  return (
    <View style={styles.pageWrapper}>
      <SelectDoctorModal
        isVisible={showModal}
        selectedDoctorEstablishmentId={selectedDoctorEstablishmentId}
        selectedDoctorId={selectedDoctorId}
        setSelectedDoctorId={setSelectedDoctorId}
        setSelectedDoctorEstablishmentId={setSelectedDoctorEstablishmentId}
        nextButtonStepPressed={nextButtonStepPressed}
        cancelButtonPressed={cancelButtonPressed}
        availabeDoctorEstablishmentsItems={availabeDoctorEstablishmentsItems}
        availabeDoctorItems={availabeDoctorItems}
        isFetchingAvailabeDoctors={
          isFetching || isLoadingAvailableDoctorEstablishments
        }
      />
      <PageContainer variant="none">
        <KeyboardAwareScrollView
          extraScrollHeight={100}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}>
          <DoctorCard
            doctorEstablishment={selectedDoctorEstablishmentName ?? ''}
            doctorName={selectedDoctorName}
            onSwitchButtonPressed={() => setShowModal(true)}
          />
          <Calendar
            selectedDate={selectedDate}
            onAvailabeDayPress={onAvailableDayPress}
            markedDays={availabledDates}
            futureScrollRange={6}
            pastScrollRange={0}
          />
          <View style={styles.selectGroupHeader}>
            <Typography
              variant="b1"
              fontWeight="bold"
              text={t('bookAppointment.selectTime')}
            />
            {spotsSortedByDate[selectedDate] && (
              <Typography
                color={Theme.colors.primary}
                variant="b1"
                fontWeight="bold"
                text={moment(spotsSortedByDate[selectedDate].datum).format(
                  'DD MMM YYYY',
                )}
              />
            )}
          </View>
          <View>{renderAvailableSpots()}</View>
          <View style={styles.reasonContainer}>
            <TextInput
              onChangeText={handleChange('reason')}
              value={values.reason}
              error={errors.reason}
              errorColor="red"
              multiline
              mainColor="black"
              label={t('bookAppointment.enterReasonAppointment')}
            />
          </View>
          <Button
            buttonStyle={styles.bookAppointmentButton}
            onPress={handleSubmit}
            text={t('bookAppointment.bookAppointment')}
          />
        </KeyboardAwareScrollView>
      </PageContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  calendar: {
    width: 375,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  selectGroupHeader: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reasonContainer: {
    marginTop: 40,
  },
  reasonAppointment: {
    marginBottom: -10,
  },
  bookAppointmentButton: {
    backgroundColor: Theme.colors.primary,
    marginTop: 25,
  },
});

export default BookAppointmentScreen;
