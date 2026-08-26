import React, {useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';

import {faFileSignature} from '@fortawesome/pro-regular-svg-icons';
import {StackScreenProps} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import {
  Button,
  ErrorView,
  FloatingActionButton,
  Loader,
  Typography,
} from '@src/components';
import {TransactionTypes} from '@src/constants';
import {Theme} from '@src/styles';
import useAuthStore from '@src/stores/useAuthStore';
import {PrescriptionStackParamList} from '@src/navigations/prescription-navigator';

import PrescriptionItem from '../components/PrescriptionItem';
import useFetchPrescriptions from '../hooks/useFetchPrescriptions';
import {Prescription} from '../prescription';
import {useEffect} from 'react';

type Props = StackScreenProps<PrescriptionStackParamList, 'AllPrescriptions'>;

const AllPrescriptionsScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const apuId = useAuthStore(state => state.user?.apuId);

  const {t} = useTranslation();
  const [isMandansa, setIsMandansa] = useState(false);
  const {data, isPending, refetch, error, isFetching, isError} =
    useFetchPrescriptions(apuId!, route.params?.mdsId);
  const isOwnPrescriptionContext = route.params?.user === undefined;

  useEffect(() => {
    if (isOwnPrescriptionContext) {
      setIsMandansa(false);
      return navigation.setOptions({
        title: t('prescriptions.myPrescriptions'),
      });
    }

    const mandansaUser = route.params.user;

    setIsMandansa(true);
    navigation.setOptions({
      title: `${mandansaUser.naam}'s ${t('prescriptions.prescriptions')}`,
    });
  }, [isOwnPrescriptionContext, navigation, route, t]);

  const onQRIconPressed = (prescription: Prescription) => {
    const mdsUser = route.params?.user;

    navigation.navigate('Identify', {
      data: prescription,
      id: prescription.recId,
      mdsId: route.params?.mdsId ?? 0,
      transactionType: isMandansa
        ? TransactionTypes.Mandansa
        : TransactionTypes.Recept,
      mdsUser: isMandansa ? mdsUser : undefined,
    });
  };

  const renderItem = ({
    item: prescription,
    index,
  }: {
    item: Prescription;
    index: number;
  }) => {
    return (
      <PrescriptionItem
        onQRIconPressed={onQRIconPressed}
        index={index}
        prescription={prescription}
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (isError) {
      return (
        <View style={styles.noPrescriptionsFoundContainer}>
          <ErrorView
            goBack={() => navigation.goBack()}
            reload={refetch}
            error={error}
          />
        </View>
      );
    }

    return (
      <View style={styles.noPrescriptionsFoundContainer}>
        <Typography
          textStyle={styles.noPrescriptionsFoundText}
          text={t('prescriptions.noPrescriptionsFound')}
          variant="h4"
        />
        <Button onPress={() => refetch()} variant="primary" text="refresh" />
      </View>
    );
  };

  const keyExtractor = (_: Prescription, index: number) => `${index}`;

  const handleDigitalSignaturePress = () => {
    navigation.navigate('DigitalSignature');
  };

  const renderDigitalSignatureButton = () => {
    if (!isOwnPrescriptionContext) {
      return null;
    }

    return (
      <FloatingActionButton
        accessibilityLabel={t('digitalSignature.fabAccessibilityLabel')}
        accessibilityRole="button"
        icon={faFileSignature}
        iconOffsetX={3}
        iconSize={22}
        onPress={handleDigitalSignaturePress}
      />
    );
  };

  const {
    colors: {primary},
  } = Theme;

  if (isPending) {
    return (
      <View style={styles.container}>
        <Loader
          textColor={primary}
          indicatorColor={primary}
          text={t('prescriptions.loadingPrescriptions')}
        />
        {renderDigitalSignatureButton()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatListContent}
        onRefresh={refetch}
        refreshing={isFetching}
        keyExtractor={keyExtractor}
        data={data?.recepten}
        ListEmptyComponent={renderListEmptyComponent}
        renderItem={renderItem}
      />
      {renderDigitalSignatureButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flatListContent: {
    flexGrow: 1,
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPrescriptionsFoundText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  noPrescriptionsFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default AllPrescriptionsScreen;
