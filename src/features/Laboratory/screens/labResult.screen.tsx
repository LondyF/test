import React from 'react';
import {View, ScrollView, StyleSheet, ColorValue} from 'react-native';

import {RouteProp} from '@react-navigation/native';

import {Typography} from '@src/components';
import {convertISOdate, convertISOdateWithTime} from '@utils/utils';
import useTheme from '@hooks/useTheme';

import {LabResult as LabResultType, LabResultRule} from '../types/laboratory';
import {LabResultRuleType} from '../types/labResultRuleType';

interface LabResultProps {
  route: RouteProp<{params: {labResult: LabResultType}}, 'params'>;
}

const RESULT_LEVEL: Record<string, {text: string; color: ColorValue}> = {
  H: {
    text: 'High',
    color: 'red',
  },
  HH: {
    text: 'Extra High',
    color: '#8B0000',
  },
  L: {
    text: 'Low',
    color: 'orange',
  },
  LL: {
    text: 'Extra Low',
    color: '#F5CC0D',
  },
  N: {
    text: 'Normal',
    color: '#16c44d',
  },
};

const LabResult: React.FC<LabResultProps> = ({
  route: {
    params: {labResult},
  },
}) => {
  const theme = useTheme();

  const renderGroupHeader = ({groep}: LabResultRule, index: number) => (
    <Typography
      key={index}
      textStyle={styles.groepHeader}
      variant="h3"
      fontWeight="bold"
      text={groep}
    />
  );

  const renderTest = (
    {hoogLaag, test, refWaarde, uitslag, eenheid}: LabResultRule,
    index: number,
  ) => (
    <View key={index} style={styles.test}>
      <View style={styles.flexRow}>
        <View style={styles.testNameContainer}>
          <View style={[styles.flexRow, styles.alignCenter]}>
            <View
              style={[
                styles.resultLevelBulletIndicator,
                {backgroundColor: RESULT_LEVEL[hoogLaag ?? 'N'].color},
              ]}
            />
            <Typography
              variant="h4"
              color="gray"
              fontWeight="600"
              text={test}
            />
          </View>
          <Typography
            variant="b2"
            fontWeight="500"
            textStyle={styles.resultLevelText}
            text={RESULT_LEVEL[hoogLaag ?? 'N'].text}
            color={RESULT_LEVEL[hoogLaag ?? 'N'].color}
          />
        </View>
        <View style={styles.testResultContainer}>
          <Typography variant="h4" fontWeight="bold" text={uitslag} />
          <View style={styles.eenheidContainer}>
            <Typography align="left" variant="h6" color="gray" text={eenheid} />
          </View>
        </View>
      </View>
      <View style={styles.flexRow}>
        <View style={styles.resultLevelContainer} />
        <View style={styles.refWaardeContainer}>
          <Typography variant="b2" text={refWaarde} />
        </View>
      </View>
    </View>
  );

  const renderNote = ({noot}: LabResultRule, index: number) => (
    <Typography
      key={index}
      color="gray"
      fontWeight="bold"
      variant="h6"
      text={noot}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" fontWeight="bold" text="Lab Resultaat" />
        <Typography
          variant="h4"
          fontWeight="bold"
          color={theme.colors.darkGray}
          text={convertISOdate(labResult.prikDatum)}
          textStyle={styles.headerItemSpacing}
        />
        <Typography
          variant="b2"
          text={`verwerkt op: ${convertISOdateWithTime(
            labResult.verwerkDatumTijd,
          )}`}
          textStyle={styles.headerItemSpacing}
        />
        <Typography
          variant="b2"
          text={`Lab nummer: ${labResult.lnr}`}
          textStyle={styles.headerItemSpacing}
        />
        <Typography variant="b2" text={labResult.naam} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {labResult?.uitslag?.map((item: any, index: any) => {
          if (item.recType === LabResultRuleType.Group) {
            return renderGroupHeader(item, index);
          }

          if (item.recType === LabResultRuleType.Test) {
            return renderTest(item, index);
          }

          return renderNote(item, index);
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    paddingBottom: 20,
  },
  headerItemSpacing: {
    marginBottom: 2,
  },
  contentContainer: {
    paddingBottom: 150,
  },
  groepHeader: {
    marginTop: 5,
  },
  test: {
    marginVertical: 5,
  },
  flexRow: {
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
  },
  testNameContainer: {
    flex: 0.7,
  },
  resultLevelBulletIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  testResultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.3,
    justifyContent: 'space-between',
  },
  eenheidContainer: {
    flex: 1,
    marginLeft: 5,
  },
  resultLevelContainer: {
    flex: 0.7,
    paddingLeft: 20,
  },
  refWaardeContainer: {
    flex: 0.3,
    marginLeft: -20,
  },
  resultLevelText: {
    marginLeft: 20,
  },
});

export default LabResult;
