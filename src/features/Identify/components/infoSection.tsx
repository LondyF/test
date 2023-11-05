import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import {Theme} from '@styles/styles';

interface Props {
  infoData: Record<string, Record<string, {}>>;
  theme: Theme;
}

const InfoSection: React.FC<Props> = ({theme, infoData}) => {
  const styles = makeStyles(theme);

  return (
    <View style={{paddingHorizontal: theme.spacing.horizontalPadding / 2}}>
      {Object.entries(infoData).map(([type, info], indx) => (
        <View style={styles.itemContainer} key={indx}>
          <Text style={styles.infoTitle}>{type}: </Text>
          {Object.values(info).map((item, index) => (
            <View key={index}>
              {index === 0 ? (
                <Text style={styles.infoText}>{item + ' '}</Text>
              ) : (
                <Text style={styles.infoExtraInfo}>{`(${item})`}</Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      marginBottom: 8,
      alignItems: 'center',
    },
    baseInfoText: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 12,
    },
    infoTitle: {
      color: theme.colors.darkGray,
      textTransform: 'capitalize',
    },
    infoText: {
      fontWeight: 'bold',
      color: 'black',
      fontSize: 16,
    },
    infoExtraInfo: {
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: theme.colors.primary,
      fontSize: 16,
    },
  });

export default InfoSection;
