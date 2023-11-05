import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TextInput} from 'react-native';

import {RouteProp, useNavigation} from '@react-navigation/native';

import {Appointment} from '../types/appointments';
import {AppointmentStatus} from '../types/appointmentStatus';

import {Button, PageContainer, Typography} from '@src/components';
import {Theme} from '@src/styles';
import useChangeAppointmentStatus from '../hooks/useChangeAppointmentStatus';
import useAuthStore from '@src/stores/useAuthStore';
import {useTranslation} from 'react-i18next';

interface Props {
  route: RouteProp<
    {
      params: {
        appointment: Appointment;
      };
    },
    'params'
  >;
}

const DeclineAppointmentScreen: React.FC<Props> = ({
  route: {
    params: {
      appointment: {docter, id, datum},
    },
  },
}) => {
  const user = useAuthStore(state => state.user);
  const [inputText, setInputText] = useState('');
  const {mutate} = useChangeAppointmentStatus(user?.apuId || -1);
  const {t} = useTranslation();
  const navigation = useNavigation();

  const declineAppointment = () => {
    let appointmentObj = {
      appointmentId: id,
      vesId: docter[0].vesId,
      reasonText: inputText,
    };

    mutate({
      appointmentStatus: AppointmentStatus.DECLINED,
      ...appointmentObj,
    });

    navigation.goBack();
  };

  const getTime = () => {
    let dateString = datum.toString().split('T')[1];
    return dateString.substring(0, dateString.length - 3) || '';
  };

  return (
    <PageContainer variant="gray">
      <ScrollView contentContainerStyle={styles.scrollViewContainerStyle}>
        <View style={styles.container}>
          <View style={styles.box}>
            <Typography
              textStyle={styles.title}
              color={Theme.colors.primary}
              text={t('cancelAppointment.cancelAppointment')}
              fontWeight="bold"
              variant="h4"
            />
            <Typography
              text={t('cancelAppointment.cancelText', {
                doctor: docter[0].naam,
                time: getTime(),
              })}
              textStyle={styles.cancelText}
              fontWeight="bold"
              variant="b1"
            />
            <View style={styles.textInputContainer}>
              <Typography
                text={t('cancelAppointment.reason')}
                fontWeight="bold"
                textStyle={styles.textInputLabel}
                variant="b1"
                color={Theme.colors.primary}
              />
              <TextInput
                style={styles.textInput}
                onChangeText={text => setInputText(text)}
                defaultValue={inputText}
                placeholder={t('cancelAppointment.reason')}
                numberOfLines={1}
                multiline={true}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                buttonStyle={styles.button}
                variant="primary"
                text={t('cancelAppointment.cancelAppointment')}
                onPress={declineAppointment}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollViewContainerStyle: {
    flexGrow: 1,
  },
  box: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  buttonContainer: {
    justifyContent: 'center',
  },
  button: {
    borderRadius: 10,
  },
  textInputContainer: {
    marginBottom: 50,
    marginTop: 35,
  },
  textInput: {
    height: 200,
    maxHeight: 200,
    textAlignVertical: 'top',
    borderColor: 'black',
    borderWidth: 1,
    padding: 20,
    borderRadius: 15,
  },
  textInputLabel: {
    marginLeft: 10,
    marginBottom: 5,
  },
  cancelText: {
    textAlign: 'center',
  },
  title: {
    marginBottom: 30,
  },
});

export default DeclineAppointmentScreen;
