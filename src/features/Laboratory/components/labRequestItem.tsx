import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, View, Text, Image} from 'react-native';

import {useTranslation} from 'react-i18next';

import {ListItem, Typography} from '@src/components';
import {Theme} from '@styles/styles';
import {convertISOdate} from '@utils/utils';

import {LabRequest} from '../types/laboratory';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCalendarPlus} from '@fortawesome/pro-regular-svg-icons';
import {useNavigation} from '@react-navigation/native';

interface Props {
  labRequest: LabRequest;
  index: number;
  onQRIconPressed: (labRequest: LabRequest) => void;
  onAppointmentIconPressed: any;
  theme: Theme;
}

const LabRequestItem: React.FC<Props> = ({
  labRequest,
  index,
  theme,
  onQRIconPressed,
  onAppointmentIconPressed,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {navigate} = useNavigation();

  const {t} = useTranslation();

  const {darkGray, primary} = theme.colors;

  const isAlreadyPricked = labRequest.prikLokId > 0;

  const showQRCode =
    !isAlreadyPricked && isCollapsed && labRequest.showQr === 1;
  const showAppointmentIcon = isCollapsed && labRequest.showThuisPrikken === 1;

  return (
    <TouchableOpacity
      onPress={() => setIsCollapsed(_isCollapsed => !_isCollapsed)}>
      <ListItem style={styles.itemContainer} index={index}>
        <View
          style={{
            ...styles.leftBorder,
            backgroundColor: isAlreadyPricked ? darkGray : primary,
          }}
        />
        <View style={styles.flex}>
          <View style={styles.flexRow}>
            <Typography
              text={labRequest.artNaam}
              variant="h4"
              color={darkGray}
              fontWeight="bold"
            />
            <Typography
              text={convertISOdate(labRequest.datum)}
              variant="h5"
              color="#b8b8b8"
            />
          </View>

          <View style={styles.flexRow}>
            <Typography
              text={labRequest.vesNaam}
              variant="h5"
              color="#b8b8b8"
            />
            <View style={styles.flexRow}>
              {showAppointmentIcon && (
                <TouchableOpacity
                  onPress={() => onAppointmentIconPressed(labRequest)}
                  style={styles.appointmentIcon}>
                  <FontAwesomeIcon
                    size={20}
                    color={darkGray}
                    icon={faCalendarPlus}
                  />
                </TouchableOpacity>
              )}

              {showQRCode && (
                <TouchableOpacity
                  onPress={() => onQRIconPressed(labRequest)}
                  style={styles.qrButtonContainer}>
                  <Image
                    style={styles.qrButton}
                    source={require('@assets/qrcodeIcon.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {isAlreadyPricked && (
            <Typography
              text={`${t('allLabRequests.prickedAt')} ${labRequest.prkNaam}`}
              textStyle={styles.prickedBy}
              variant="h5"
              fontStyle="italic"
              color="#b8b8b8"
            />
          )}

          {labRequest?.statusMsg && (
            <Typography
              textStyle={styles.statusMsg}
              variant="h5"
              fontStyle="italic"
              color="#b8b8b8"
              fontWeight="600"
              text={labRequest.statusMsg}
            />
          )}

          {isCollapsed && (
            <View style={styles.labTestenContainer}>
              {labRequest.groep.map(({tsg_naam, testen}, key) => (
                <View key={key} style={styles.testen}>
                  <Typography variant="h4" fontWeight="bold" text={tsg_naam} />
                  {testen.map(({tst_naam, isPrikSelected}, idx) => (
                    <View key={idx} style={styles.testContainer}>
                      <View style={styles.isSelectedContainer}>
                        <Typography
                          variant="b1"
                          text={`${isPrikSelected === 'x' ? '×' : ''}`}
                        />
                      </View>
                      <Typography variant="b1" text={tst_naam} />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </ListItem>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
  },
  labTestenContainer: {
    marginTop: 15,
  },
  testen: {
    marginBottom: 10,
  },
  prickedBy: {
    marginTop: 5,
  },
  testContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  isSelectedContainer: {
    width: 15,
    alignItems: 'center',
  },
  qrButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  qrButton: {
    width: 25,
    height: 25,
  },
  leftBorder: {
    width: 5,
    height: '100%',
    backgroundColor: 'red',
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  appointmentIcon: {
    marginRight: 30,
  },
  statusMsg: {
    marginTop: 5,
  },
});

export default LabRequestItem;
