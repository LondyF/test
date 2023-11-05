import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft} from '@fortawesome/pro-light-svg-icons';
import {useTranslation} from 'react-i18next';

import {Button, Loader, Typography} from '@src/components';
import {Theme} from '@styles/styles';
import useTheme from '@hooks/useTheme';
import useAuthStore from '@stores/useAuthStore';

import useFetchNotifications from '../hooks/useFetchAllNotifications';
import useDeleteNotification from '../hooks/useDeleteNotification';
import {Notification} from '../types/notifications';
import moment from 'moment';

interface NotificationsGroup {
  name: string;
  notifications: Notification[];
}

interface AllNotificationsProps {
  navigation: any;
}

const AllNotifications: React.FC<AllNotificationsProps> = ({navigation}) => {
  const {t} = useTranslation();

  const theme = useTheme();
  const styles = makeStyles(theme);
  const apuId = useAuthStore(state => state.user?.apuId);

  const {isLoading, isFetching, data, refetch} = useFetchNotifications(apuId!);
  const {mutate} = useDeleteNotification(apuId!);
  const {primary} = theme.colors;

  const groupNotifications = (notifications: Notification[]) => {
    if (notifications?.length <= 0) {
      return [];
    }

    const newNotifications = notifications.filter(x => x.new === 1);
    const oldNotifications = notifications.filter(x => x.new === 0);

    return [
      {
        name: t('notifications.new'),
        notifications: newNotifications ?? [],
      },
      {
        name: t('notifications.old'),
        notifications: oldNotifications ?? [],
      },
    ] as NotificationsGroup[];
  };

  const displayDeleteConfirmation = (notificationId: number) => {
    Alert.alert(t('common.areYouSure'), t('notifications.doYouWantToDelete'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
        onPress: () => null,
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => mutate({notificationId}),
      },
    ]);
  };

  const keyExtractor = (_: NotificationsGroup, index: number) => `${index}`;

  const renderItem = ({
    item,
    index,
  }: {
    index: number;
    item: NotificationsGroup;
  }) => {
    if (item.notifications.length <= 0) {
      return null;
    }

    return (
      <TouchableOpacity
        key={index}
        style={{
          paddingHorizontal: theme.spacing.horizontalPadding,
        }}>
        <Typography variant="h3" fontWeight="bold" text={item.name} />
        <View style={styles.hr} />
        <>
          {item.notifications.map((notification, innerIndex) => (
            <TouchableOpacity
              key={innerIndex}
              onLongPress={() => displayDeleteConfirmation(notification.id)}
              style={styles.notificationContainer}>
              <View style={styles.leftBorder} />
              <View style={styles.flex}>
                <View style={styles.titleContainer}>
                  <Typography
                    variant="h4"
                    fontWeight="600"
                    color="#333"
                    text={notification.onderwerp}
                  />
                  <Typography
                    variant="b2"
                    fontWeight="bold"
                    fontStyle="italic"
                    color={primary}
                    text={moment(notification.createDatum).fromNow()}
                  />
                </View>
                <Typography
                  variant="b1"
                  color={theme.colors.darkGray}
                  text={notification.tekst}
                />
              </View>
            </TouchableOpacity>
          ))}
        </>
      </TouchableOpacity>
    );
  };

  const emptyListComponent = (
    <View style={styles.emptyListContainer}>
      <Image style={styles.bell} source={require('@assets/sadbell.png')} />
      <Typography
        variant="h4"
        color={primary}
        fontWeight="bold"
        text={t('notifications.noNotificationsFound')}
        textStyle={styles.marginVertical}
      />
      <Button
        onPress={() => refetch()}
        variant="outline"
        buttonStyle={{borderColor: primary}}
        textStyle={{color: primary}}
        text={t('common.reload')}
      />
    </View>
  );

  const groupedNotifications = groupNotifications(
    data?.notifications.data ?? [],
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[
          styles.flexRow,
          {
            paddingHorizontal: theme.spacing.horizontalPadding,
          },
        ]}>
        <FontAwesomeIcon style={styles.icon} size={30} icon={faAngleLeft} />
        <Typography
          variant="h2"
          fontWeight="bold"
          text={t('notifications.allNotifications')}
        />
      </TouchableOpacity>
      {isLoading || isFetching ? (
        <Loader
          containerStyle={styles.flex}
          textColor={primary}
          indicatorColor={primary}
          text={t('notifications.loadingNotifications')}
        />
      ) : (
        <View style={styles.notificationsContainer}>
          <FlatList
            data={groupedNotifications}
            refreshing={isFetching}
            contentContainerStyle={styles.flexGrow}
            style={styles.flex}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={emptyListComponent}
          />
        </View>
      )}
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    flexGrow: {
      flexGrow: 1,
    },
    marginVertical: {
      marginVertical: 30,
    },
    container: {
      flex: 1,
      paddingVertical: theme.spacing.verticalPadding + 15,
      backgroundColor: 'white',
    },
    notificationsContainer: {
      flex: 1,
      paddingTop: 15,
    },
    emptyListContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.horizontalPadding,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationContainer: {
      flexDirection: 'row',
      paddingVertical: 15,
    },
    bell: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
    hr: {
      height: 0.5,
      backgroundColor: theme.colors.lightGray,
      marginVertical: 7,
    },
    titleContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2.5,
      flex: 1,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginLeft: -10,
    },
    leftBorder: {
      width: 5,
      backgroundColor: theme.colors.primary,
      marginRight: 10,
    },
  });

export default AllNotifications;
