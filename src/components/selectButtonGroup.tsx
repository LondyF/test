import React, {useCallback, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SelectButton from './selectButton';

export interface SelectButtonGroupItem {
  id: number;
  title: string;
}

interface SelectButtonGroupProps {
  items: Array<SelectButtonGroupItem>;
  single?: boolean;
  onItemPress: (id: number, items?: Array<number>) => void;
  selectedItem: Array<number> | number;
}

const SelectButtonGroup: React.FC<SelectButtonGroupProps> = ({
  items,
  onItemPress,
  selectedItem,
  single = false,
}) => {
  useEffect(() => {
    if (single && Array.isArray(selectedItem)) {
      throw Error(
        'single property is "true" but you are passing an array of multipule selected items',
      );
    }
    if (!single && !Array.isArray(selectedItem)) {
      throw Error(
        'single property is "false" but you not passing an array to selected items property',
      );
    }
  }, [selectedItem, single]);

  const styles = makeStyles();
  let canSelectMultipule = !single && Array.isArray(selectedItem);

  const deselectItem = useCallback(
    (id: number) => {
      onItemPress(
        id,
        (selectedItem as number[]).filter(x => x !== id),
      );
    },
    [onItemPress, selectedItem],
  );

  const selectMultipuleItem = useCallback(
    (id: number) => {
      onItemPress(id, [...(selectedItem as number[]), id]);
    },
    [onItemPress, selectedItem],
  );

  const selectSingleItem = useCallback(
    (id: number) => {
      onItemPress(id);
    },
    [onItemPress],
  );

  const handleMultipuleItems = useCallback(
    (id: number) => {
      !(selectedItem as number[]).includes(id)
        ? selectMultipuleItem(id)
        : deselectItem(id);
    },
    [deselectItem, selectMultipuleItem, selectedItem],
  );

  const handleItemPressed = useCallback(
    (id: number) => {
      single ? selectSingleItem(id) : handleMultipuleItems(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [single, selectSingleItem],
  );

  return (
    <View style={styles.selectButtonGroupWrapper}>
      {items.map(({id, title}) => {
        let isSelected = canSelectMultipule
          ? (selectedItem as number[]).includes(id)
          : selectedItem === id;
        return (
          <SelectButton
            key={id}
            onPress={handleItemPressed}
            isSelected={isSelected}
            title={title}
            id={id}
          />
        );
      })}
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    selectButtonGroupWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    selectButtonContainerBase: {
      backgroundColor: '#F8F8F8',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      minHeight: 20,
      marginBottom: 15,
      minWidth: '48%',
      alignSelf: 'stretch',
      alignItems: 'center',
    },
    selectButtonContainerSelected: {
      backgroundColor: '#50A6D818',
    },
    selectButtonTextBase: {
      color: '#B2B2B2',
      fontWeight: 'bold',
      fontSize: 12,
    },
    selectButtonTextSelected: {
      color: '#51A6D9',
    },
  });

export default React.memo(SelectButtonGroup);
