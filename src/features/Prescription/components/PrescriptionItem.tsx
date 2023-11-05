import React, {useState} from 'react';
import {TouchableOpacity, View, Image, StyleSheet} from 'react-native';

import {useTranslation} from 'react-i18next';

import {Typography, ListItem} from '@src/components';
import {convertISOdate} from '@utils/utils';
import {Theme} from '@src/styles';

import {Prescription} from '../prescription';

interface Props {
  prescription: Prescription;
  index: number;
  onQRIconPressed: (prescription: Prescription) => void;
}

const PrescriptionItem: React.FC<Props> = ({
  index,
  prescription,
  onQRIconPressed,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {t} = useTranslation();
  const {
    colors: {darkGray, gray, primary},
  } = Theme;
  const {pb, botNaam, datum, artNaam, vesNaam, regels, recId} = prescription;
  const isPrescriptionPickedUp = botNaam && botNaam.trim() !== '';
  const hasPrefferedBotika =
    pb.trim() !== '' && !isPrescriptionPickedUp && pb !== '-';

  const _artsNaam = artNaam.substring(0, artNaam.indexOf('-'));

  return (
    <TouchableOpacity key={index} onPress={() => setIsCollapsed(!isCollapsed)}>
      <ListItem style={styles.mainContainer} index={index}>
        <View
          style={{
            ...styles.leftBorder,
            backgroundColor: isPrescriptionPickedUp ? darkGray : primary,
          }}
        />
        <View style={styles.flex}>
          <View style={styles.artsNaamContainer}>
            <View style={styles.innerArtsNaamContainer}>
              <Typography
                variant="h4"
                color={darkGray}
                fontWeight="bold"
                text={_artsNaam}
              />
              <Typography
                textStyle={styles.textMargin}
                variant="h5"
                color={primary}
                fontWeight="bold"
                text={`(#${recId.toString()})`}
              />
            </View>
            <Typography
              variant="h4"
              color={gray}
              text={convertISOdate(datum)}
            />
          </View>
          <View style={styles.secondRow}>
            <Typography
              color="#b8b8b8"
              variant="h5"
              fontWeight="500"
              text={vesNaam}
            />
            <View style={styles.qrButtonContainer}>
              {!isPrescriptionPickedUp && isCollapsed && (
                <TouchableOpacity onPress={() => onQRIconPressed(prescription)}>
                  <Image
                    style={styles.qrButton}
                    source={require('@assets/qrcodeIcon.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {isPrescriptionPickedUp ? (
            <Typography
              color="#b8b8b8"
              fontWeight="500"
              variant="h5"
              textStyle={styles.readyOrPickedUp}
              text={`${t('prescriptions.pickedUpAt')}: ${botNaam}`}
            />
          ) : (
            <Typography
              color="#b8b8b8"
              fontWeight="500"
              variant="h5"
              textStyle={styles.readyOrPickedUp}
              text={`${t('prescriptions.pickUpAt')}: ${
                hasPrefferedBotika ? pb : t('prescriptions.pharmacyOfChoice')
              }`}
            />
          )}
          {isCollapsed &&
            regels.map((item, idx) => (
              <View key={idx} style={styles.flexRow}>
                <View style={styles.sideTextContainer}>
                  <Typography color={darkGray} variant="b1" text="&#10004;" />
                </View>
                <View style={styles.sideTextContainer}>
                  <Typography
                    color={darkGray}
                    variant="h4"
                    fontWeight="bold"
                    text="R/"
                  />
                  <View style={styles.SContainer}>
                    <Typography color={darkGray} variant="h5" text="S." />
                  </View>
                </View>
                <View style={styles.flex}>
                  <Typography
                    color={darkGray}
                    variant="h4"
                    fontWeight="bold"
                    text={item.medNaam}
                  />
                  <Typography
                    color={darkGray}
                    variant="h5"
                    text={item.aantal}
                  />
                  <Typography
                    color={darkGray}
                    variant="h5"
                    text={item.dosering}
                  />
                </View>
              </View>
            ))}
        </View>
      </ListItem>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  mainContainer: {
    paddingVertical: 25,
    paddingHorizontal: Theme.spacing.horizontalPadding,
    flexDirection: 'row',
  },
  artsNaamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerArtsNaamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 0.9,
  },
  textMargin: {
    marginBottom: -1,
  },
  SContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  readyOrPickedUp: {
    fontStyle: 'italic',
  },
  sideTextContainer: {
    width: 30,
  },
  flexRow: {
    flexDirection: 'row',
    marginTop: 15,
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  qrButton: {
    width: 30,
    height: 30,
  },
  qrButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  leftBorder: {
    width: 5,
    height: '100%',
    backgroundColor: 'gray',
    marginRight: 10,
  },
});

export default PrescriptionItem;
