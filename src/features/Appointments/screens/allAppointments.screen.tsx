import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import CalendarStrip from 'react-native-calendar-strip';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import moment, {Moment} from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCalendarAlt} from '@fortawesome/free-regular-svg-icons';
import {
  faBars,
  faCalendarExclamation,
} from '@fortawesome/pro-regular-svg-icons';
import {faPlus} from '@fortawesome/pro-solid-svg-icons';
import {useTranslation} from 'react-i18next';

import useTheme from '@hooks/useTheme';
import {Theme} from '@styles/styles';
import {getDatesBetweenDates} from '@utils/utils';
import {
  ErrorView,
  FloatingActionButton,
  Loader,
  PageContainer,
  Typography,
} from '@src/components';
import useAuthStore from '@stores/useAuthStore';
import useInternetConnection from '@hooks/useInternetConnection';

import useFetchAllAppointments from '../hooks/useFetchAllAppointments';
import useChangeAppointmentStatus from '../hooks/useChangeAppointmentStatus';
import {Appointment, AppointmentDay} from '../types/appointments';
import DayComponent from '../components/DayComponent';
import AppointmentBlock from '../components/AppointmentBlock';
import {AppointmentStatus} from '../types/appointmentStatus';

interface AllAppointmentsScreenProps {
  route: RouteProp<{params: {user: User; mdsId?: number}}, 'params'>;
  navigation: NavigationProp<{}>;
}

const AllAppointmentsScreen: React.FC<AllAppointmentsScreenProps> = ({
  route,
  navigation: {setOptions},
}) => {
  const user = useAuthStore(state => state.user);
  const appTheme = useTheme();
  const styles = makeStyles(appTheme);
  const {data, isLoading, refetch, isFetching, isError, error} =
    useFetchAllAppointments(user!.apuId, route.params?.mdsId);
  const {mutate} = useChangeAppointmentStatus(user!.apuId);
  const {checkIfConnected} = useInternetConnection();
  const {t} = useTranslation();
  const {showActionSheetWithOptions} = useActionSheet();
  const [sortedAppointments, setSortedAppointments] =
    useState<Array<AppointmentDay>>();
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const {navigate, goBack} = useNavigation();

  let optionsArr = [
    t('appointments.accept'),
    t('appointments.callOff'),
    t('appointments.cancel'),
  ];
  const days = useMemo(
    () => [
      t('appointments.sunday'),
      t('appointments.monday'),
      t('appointments.tuesday'),
      t('appointments.wednesday'),
      t('appointments.thursday'),
      t('appointments.friday'),
      t('appointments.saturday'),
    ],
    [t],
  );

  const firstUpdate = useRef(true);
  const selectedWeek = useRef<{start: Moment; end: Moment} | null>(null);
  const calendarRef = useRef<any>(null);
  const iconColor = !showAllAppointments
    ? appTheme.colors.primary
    : appTheme.colors.gray;

  useEffect(() => {
    if (route.params?.user === undefined) {
      return setOptions({
        title: t('appointments.myAppointments'),
      });
    }

    const mandansaUser = route.params.user;
    setOptions({
      title: `${mandansaUser.naam}'s ${t('prescriptions.prescriptions')}`,
    });
  }, [route.params?.user, setOptions, t]);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
  });

  const showAllAppointmentsPressed = useCallback(() => {
    const allAppointments = [];
    const allDates = groupApointmentsByDate(data?.appointments);

    if (allDates) {
      for (const [date, appointments] of Object.entries(allDates)) {
        allAppointments.push({
          day: days[moment(date).day()],
          date: moment(date).toDate(), //Seems wierd.... Dates in javascript :-)
          appointments,
        } as AppointmentDay);
      }
    }
    setSortedAppointments(allAppointments);
  }, [data?.appointments, days]);

  const getAppointmentsBetweenDates = useCallback(
    (start: Moment, end: Moment) => {
      if (showAllAppointments) {
        showAllAppointmentsPressed();
        return;
      }

      selectedWeek.current = {start, end};

      let dates = getDatesBetweenDates(start.toDate(), end.toDate());

      let sortedAppointmentsArray = dates
        .map(date => {
          var filteredAppointments = data?.appointments?.filter(
            (x: Appointment) =>
              date.toDateString() === moment(x.datum).toDate().toDateString(),
          );
          return {
            day: days[date.getDay()],
            date: date,
            appointments:
              filteredAppointments !== undefined ? filteredAppointments : [],
          } as AppointmentDay;
        })
        .filter(x => x.appointments.length > 0);

      setSortedAppointments(sortedAppointmentsArray);
    },
    [data, days, showAllAppointments, showAllAppointmentsPressed],
  );

  const getOptions = (status: AppointmentStatus) => {
    return optionsArr.filter(
      x => x !== (status === AppointmentStatus.PENDING ? '' : 'Accept'),
    );
  };

  const appointmentPressed = (appointment: Appointment) => {
    checkIfConnected(() => {
      if (
        appointment.status !== AppointmentStatus.ACCEPTED &&
        appointment.status !== AppointmentStatus.PENDING
      ) {
        return;
      }

      if (appointment.canChange === 'N') {
        Alert.alert('Error', t('appointments.confirmNotYetAccepted'));
        return;
      }

      let options = getOptions(appointment.status);

      const cancelButtonIndex = options.length - 1;
      showActionSheetWithOptions(
        {
          options: options,
          cancelButtonIndex,
        },
        buttonIndex => {
          if (buttonIndex === cancelButtonIndex) {
            return;
          }

          const option = options[buttonIndex];
          appointmentOptionChosen(option, appointment);
        },
      );
    });
  };

  const appointmentOptionChosen = (
    option: string,
    appointment: Appointment,
  ) => {
    let appointmentObj = {
      appointmentId: appointment.id,
      vesId: appointment.docter[0].vesId,
      reasonText: '',
    };
    if (option === optionsArr[0]) {
      mutate({
        appointmentStatus: AppointmentStatus.ACCEPTED,
        ...appointmentObj,
      });
    } else {
      navigate('declineAppointment', {appointment});
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!firstUpdate.current && selectedWeek.current == null) {
        const startOfWeek = moment().startOf('isoWeek').toDate();
        const endOfWeek = moment().endOf('isoWeek').toDate();

        getAppointmentsBetweenDates(moment(startOfWeek), moment(endOfWeek));
      } else {
        getAppointmentsBetweenDates(
          selectedWeek!.current!.start,
          selectedWeek!.current!.end,
        );
      }
    }
  }, [getAppointmentsBetweenDates, isLoading]);

  const goToNextAppointment = () => {
    if (data && data.appointments.length > 0 && !showAllAppointments) {
      let appointments = data.appointments.filter(
        x => moment(x.datum) > moment(),
      );
      if (appointments.length > 0) {
        calendarRef.current.setSelectedDate(moment(appointments[0].datum));
      } else {
        Alert.alert('info', t('appointments.noNextAppointmentFound'));
      }
    }
  };

  const groupApointmentsByDate = (appointments: Appointment[] | undefined) =>
    appointments?.reduce((acc: Record<string, Appointment[]>, value) => {
      const date = moment(value.datum).format(moment.HTML5_FMT.DATE);
      (acc[date] = acc[date] || []).push(value);
      return acc;
    }, {}) ?? {};

  const changeViewMode = () => {
    setShowAllAppointments(previousValue => {
      let newValue = !previousValue;
      newValue
        ? showAllAppointmentsPressed()
        : getAppointmentsBetweenDates(
            selectedWeek!.current!.start,
            selectedWeek!.current!.end,
          );
      return newValue;
    });
  };

  if (isLoading) {
    return (
      <Loader
        textColor={appTheme.colors.primary}
        indicatorColor={appTheme.colors.primary}
        text={t('appointments.loading')}
      />
    );
  }

  if (isError) {
    return <ErrorView goBack={goBack} reload={refetch} error={error} />;
  }

  return (
    <View style={styles.flex}>
      <PageContainer variant="none" style={styles.mainContainer}>
        <React.Fragment>
          <View style={styles.headerContainer}>
            <Typography
              textStyle={{
                ...{textAlign: 'center', marginTop: 40},
                ...(!showAllAppointments && {
                  opacity: 0,
                  height: 0,
                  marginTop: 0,
                }),
              }}
              fontWeight="bold"
              variant="h2"
              text={t('appointments.allAppointments')}
            />
            <CalendarStrip
              ref={calendarRef}
              updateWeek={false}
              highlightDateNameStyle={styles.highlightedDateText}
              highlightDateNumberStyle={styles.highlightedDateText}
              leftSelector={[]}
              rightSelector={[]}
              scrollToOnSetSelectedDate={true}
              dayComponent={props => <DayComponent {...props} />}
              onWeekScrollEnd={getAppointmentsBetweenDates}
              daySelectionAnimation={{
                type: 'background',
                duration: 20,
                highlightColor: appTheme.colors.primary,
              }}
              scrollerPaging={true}
              scrollable={true}
              style={{
                ...(!showAllAppointments && styles.calenderStrip),
              }}
            />
            <View style={styles.iconContainer}>
              <View style={styles.icon}>
                <TouchableHighlight
                  underlayColor=""
                  disabled={showAllAppointments}
                  onPress={() => {
                    !showAllAppointments &&
                      calendarRef &&
                      calendarRef!.current!.setSelectedDate(moment());
                  }}>
                  <FontAwesomeIcon
                    color={iconColor}
                    size={26}
                    icon={faCalendarAlt}
                  />
                </TouchableHighlight>
                <Typography
                  fontSize={9}
                  text={t('appointments.today')}
                  variant="b1"
                />
              </View>
              <View style={styles.icon}>
                <TouchableHighlight
                  disabled={showAllAppointments}
                  underlayColor=""
                  onPress={goToNextAppointment}>
                  <FontAwesomeIcon
                    color={iconColor}
                    size={26}
                    icon={faCalendarExclamation}
                  />
                </TouchableHighlight>
                <Typography
                  fontSize={9}
                  text={t('appointments.upcomming')}
                  variant="b1"
                />
              </View>
              <View style={styles.icon}>
                <TouchableHighlight underlayColor="" onPress={changeViewMode}>
                  <FontAwesomeIcon
                    color={appTheme.colors.primary}
                    size={26}
                    icon={faBars}
                  />
                </TouchableHighlight>
                <Typography
                  fontSize={9}
                  text={t('appointments.allAppointmentsIcon')}
                  variant="b1"
                />
              </View>
            </View>
            <View style={styles.horizontalLine} />
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl onRefresh={refetch} refreshing={isFetching} />
            }
            contentContainerStyle={styles.flex}>
            {sortedAppointments && sortedAppointments?.length < 1 ? (
              <Typography
                variant="b1"
                textStyle={styles.noAppointmentsFoundText}
                text={t('appointments.noAppointmentsFound')}
              />
            ) : (
              sortedAppointments?.map((appointmentDay, index) => {
                return (
                  <View key={index}>
                    <View style={styles.AppointmentBlockHeaderContainer}>
                      <View style={styles.timeContainer} />
                      <View style={styles.verticalLine} />
                      <View style={styles.AppointmentBlockHeader}>
                        <Typography
                          textStyle={styles.dayText}
                          text={appointmentDay.day}
                          fontWeight="bold"
                          variant="h4"
                        />
                        <Typography
                          text={moment(appointmentDay.date).format(
                            'DD-MM-YYYY',
                          )}
                          fontWeight="bold"
                          variant="h4"
                        />
                      </View>
                    </View>
                    {appointmentDay.appointments.map(
                      (appointment: Appointment, dayIndex: number) => (
                        <AppointmentBlock
                          onPress={() => appointmentPressed(appointment)}
                          key={dayIndex}
                          date={appointment.datum}
                          appointment={appointment}
                          status={appointment.status}
                        />
                      ),
                    )}
                  </View>
                );
              })
            )}
            <View style={styles.flex}>
              <View style={styles.bottom}>
                <View style={styles.timeContainer} />
                <View style={styles.verticalLine} />
              </View>
            </View>
          </ScrollView>
        </React.Fragment>
      </PageContainer>
      {user?.allowAppVis === 1 && (
        <FloatingActionButton
          icon={faPlus}
          onPress={() => navigate('bookAppointment')}
        />
      )}
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: {
      flexGrow: 1,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: 'white',
    },
    headerContainer: {
      marginBottom: 20,
    },
    highlightedDateText: {
      color: 'white',
    },
    calenderStrip: {
      height: 90,
      paddingTop: 20,
    },
    horizontalLine: {
      height: 1,
      backgroundColor: theme.colors.lightGray,
      width: '100%',
    },
    verticalLine: {
      width: 1.5,
      height: '100%',
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.lightGray,
    },
    AppointmentBlockHeaderContainer: {
      flexDirection: 'row',
    },
    AppointmentBlockHeader: {
      flexDirection: 'row',
      flex: 1,
      paddingTop: 15,
      paddingBottom: 15,
      justifyContent: 'space-between',
    },
    dayText: {
      marginLeft: 5,
    },
    appointmentBlockContainer: {
      flexDirection: 'row',
      minHeight: 80,
    },
    timeContainer: {
      paddingTop: 5,
      width: 50,
    },
    bottom: {
      flex: 1,
      width: '100%',
      flexDirection: 'row',
    },
    noAppointmentsFoundText: {
      textAlign: 'center',
      marginTop: 50,
      height: '100%',
    },
    iconContainer: {
      flexDirection: 'row',
      alignContent: 'flex-end',
      justifyContent: 'flex-end',
    },
    icon: {
      paddingHorizontal: 8,
      paddingVertical: 20,
      alignItems: 'center',
    },
  });

export default AllAppointmentsScreen;
