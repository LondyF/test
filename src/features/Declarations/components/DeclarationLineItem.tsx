import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Typography} from '@src/components';
import {DeclarationLine} from '../types/declarations';
import useTheme from '@src/hooks/useTheme';

type DeclarationLineItemProps = {
  item: DeclarationLine;
  currencyFormatter: (value: number) => string;
  additionalInfo?: string;
};

const DeclarationLineItem = ({
  item,
  currencyFormatter,
  additionalInfo,
}: DeclarationLineItemProps) => {
  const {tekst, bedrag, aantal: aantalFromItem} = item;

  const theme = useTheme();

  const aantal = aantalFromItem ?? 1;
  const total = aantal * bedrag;

  return (
    <View style={styles.container}>
      <View style={styles.declarationLineItem}>
        <Typography
          variant="h5"
          text={aantal + ' x ' + tekst}
          color="#585858"
        />
        <Typography
          variant="h5"
          text={currencyFormatter(total)}
          fontWeight="500"
          textStyle={{textAlign: 'center'}}
        />
      </View>
      {additionalInfo && (
        <Typography
          variant="h6"
          text={additionalInfo}
          color={theme.colors.primary}
          fontStyle="italic"
        />
      )}
    </View>
  );
};

export default DeclarationLineItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  declarationLineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
});
