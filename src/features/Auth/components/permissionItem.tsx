import React from 'react';
import {
  TouchableOpacity,
  Switch,
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import {Typography} from '@components/index';
// import { colors, Theme } from '@src/styles';

interface PermissionItemProps {
  permission: string;
  allowed: boolean;
  change: (value: boolean) => void;
}

const PermissionItem: React.FC<PermissionItemProps> = ({
  permission,
  allowed,
  change,
}) => {
  return (
    <TouchableOpacity style={styles.permissionItem}>
      <View style={styles.permissionTextContainer}>
        <Typography
          textStyle={styles.permissionText}
          text={permission}
          variant="b1"
        />
      </View>
      <View style={styles.switchButtonContainer}>
        <Switch
          style={
            Platform.OS === 'android' && {
              transform: [{scaleX: 1.2}, {scaleY: 1.2}],
            }
          }
          value={allowed}
          // thumbColor={colors.primary}
          // trackColor={{
          //   true: Theme.colors.lightGray,
          //   false: 'white',
          // }}
          // ios_backgroundColor="white"
          onValueChange={change}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 8,
  },
  permissionText: {
    marginRight: 10,
  },
  permissionTextContainer: {
    flex: 1,
  },
  switchButtonContainer: {
    flex: 0.2,
  },
});

export default PermissionItem;
