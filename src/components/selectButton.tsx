import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
interface SelectButtonProps {
  isSelected: boolean;
  title: string;
  id: number;
  onPress: (id: number) => void;
}
const SelectButton: React.FC<SelectButtonProps> = ({ isSelected, id, title, onPress }) => {
  return (
    <TouchableOpacity
      key={id}
      onPress={() => onPress(id)}
      style={{
        ...styles.selectButtonContainerBase,
        ...(isSelected && styles.selectButtonContainerSelected),
      }}>
      <Text
        style={{
          ...styles.selectButtonTextBase,
          ...(isSelected && styles.selectButtonTextSelected),
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default React.memo(SelectButton);
