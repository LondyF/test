import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {ListItem, Typography} from '@src/components';
import {convertISOdate} from '@utils/utils';
import {Theme} from '@styles/styles';

import {LabResult} from '../types/laboratory';
import moment from 'moment';

interface LabResultItemProps {
  index: number;
  labResult: LabResult;
  theme: Theme;
  onLabResultPress: (labResult: LabResult) => void;
}

const LabResultItem: React.FC<LabResultItemProps> = ({
  index,
  labResult,
  labResult: {prikDatum, verwerkDatumTijd, lab, avaArts, lnr},
  theme,
  onLabResultPress,
}) => {
  const styles = makeStyles(theme);
  const {
    colors: {darkGray, primary},
  } = theme;

  const handleOnPress = useCallback(() => {
    onLabResultPress(labResult);
  }, [labResult, onLabResultPress]);

  const getTimeFromISODate = (isoDate: Date) => moment(isoDate).format('HH:mm');

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <ListItem style={styles.itemContainer} index={index}>
        <View style={styles.leftBorder} />
        <View style={styles.flex}>
          <View style={styles.flexRow}>
            <View style={styles.labInfoContainer}>
              <Typography
                text={lab}
                variant="h4"
                color={darkGray}
                fontWeight="bold"
              />
              <Typography
                variant="h6"
                color={primary}
                fontWeight="bold"
                text={` (#${lnr})`}
              />
            </View>
            <Typography
              text={convertISOdate(prikDatum)}
              variant="h5"
              color="#b8b8b8"
            />
          </View>
          <Typography
            textStyle={styles.avaArtsText}
            text={avaArts}
            variant="h5"
            color="#b8b8b8"
          />
          <Typography
            variant="h5"
            fontStyle="italic"
            color="#b8b8b8"
            fontWeight="600"
            text={`Uitslag op ${convertISOdate(
              verwerkDatumTijd,
            )} om ${getTimeFromISODate(verwerkDatumTijd)} verwerkt`}
          />
        </View>
      </ListItem>
    </TouchableOpacity>
  );
};

export default LabResultItem;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    itemContainer: {
      paddingHorizontal: theme.spacing.horizontalPadding,
      paddingVertical: 15,
      flexDirection: 'row',
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    avaArtsText: {
      marginTop: 3,
      marginBottom: 8,
    },
    leftBorder: {
      width: 5,
      height: '100%',
      backgroundColor: theme.colors.primary,
      marginRight: 10,
    },
    labInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      flex: 0.9,
    },
  });
