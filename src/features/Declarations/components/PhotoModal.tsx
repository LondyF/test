import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';

import {Button, Typography} from '@src/components';

type PhotoModalProps = {
  isVisible: boolean;
  photoUrl: string;
  onClose: () => void;
};

const PhotoModal = ({
  photoUrl,
  isVisible = false,
  onClose,
}: PhotoModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={0}
      useNativeDriver
      backdropColor="black"
      onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Typography
          variant="h3"
          text="Declaration Photo"
          fontWeight="300"
          textStyle={styles.title}
        />
        <Image
          source={{
            uri: photoUrl,
          }}
          style={styles.image}
        />
        <Button
          variant="primary"
          text="Close"
          onPress={onClose}
          buttonStyle={styles.button}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
  },
  title: {
    marginBottom: 20,
  },
});

export default PhotoModal;
