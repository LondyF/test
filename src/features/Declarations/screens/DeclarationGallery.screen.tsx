import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  TouchableHighlight,
  View,
} from 'react-native';

import {NavigationProp, RouteProp} from '@react-navigation/native';

import {PageContainer, Typography} from '@src/components';
import {Theme} from '@src/styles';

import {Declaration} from '../types/declarations';
import {StyleSheet} from 'react-native';
import {useEffect} from 'react';

interface IProps {
  route: RouteProp<{params: {declaration: Declaration}}, 'params'>;
  navigation: NavigationProp<{}>;
}

const DeclarationGallery: React.FC<IProps> = ({
  route: {
    params: {declaration},
  },
  navigation: {setOptions},
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState(
    declaration?.fotos[0].foto,
  );
  const setCurrentSelectedPhoto = (url: string) => {
    if (url !== selectedPhoto) {
      setSelectedPhoto(url);
    }
  };

  useEffect(() => {
    if (declaration) {
      setOptions({title: declaration.naam});
    }
  }, [declaration, setOptions]);
  return (
    <PageContainer style={styles.container} variant="purple">
      <View style={styles.selectedPhotoContainer}>
        <Image
          style={styles.selectedPhoto}
          source={{
            uri: selectedPhoto,
            headers: {
              Pragma: 'no-cache',
              'Cache-Control': 'no-cache, no-store',
              Expires: '0',
            },
          }}
        />
      </View>
      <View style={styles.imagesContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.imagesScrollViewContent}
          persistentScrollbar={true}
          style={styles.imagesContainer}>
          {declaration.fotos.map(({foto, type, bedrag}, idx) => {
            return (
              <TouchableHighlight
                key={idx}
                onPress={() => setCurrentSelectedPhoto(foto)}>
                <ImageBackground
                  style={styles.image}
                  source={{
                    uri: foto,
                    headers: {
                      Pragma: 'no-cache',
                      'Cache-Control': 'no-cache, no-store',
                      Expires: '0',
                    },
                  }}>
                  <View style={styles.imageViewContainer}>
                    <View style={styles.statusViewContainer}>
                      <View style={styles.statusCircleContainer}>
                        <Typography
                          variant="b1"
                          fontWeight="bold"
                          color="white"
                          text={declaration.status}
                        />
                      </View>
                    </View>
                    <View style={styles.amountContainer}>
                      <Typography
                        variant="b1"
                        fontWeight="bold"
                        color="white"
                        text={type.naam}
                      />
                      <Typography
                        variant="b1"
                        fontWeight="400"
                        color="white"
                        text={`${bedrag} NAF`}
                      />
                    </View>
                  </View>
                </ImageBackground>
              </TouchableHighlight>
            );
          })}
        </ScrollView>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  selectedPhotoContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPhoto: {
    width: 300,
    flex: 1,
    height: 350,
    resizeMode: 'contain',
  },
  imagesContainer: {
    flex: 0.3,
  },
  imagesScrollView: {
    flex: 1,
  },
  imagesScrollViewContent: {
    alignItems: 'center',
  },
  image: {
    width: 160,
    height: 160,
    resizeMode: 'cover',
    marginRight: 8,
    justifyContent: 'flex-end',
  },
  imageViewContainer: {
    flex: 1,
  },
  statusViewContainer: {
    flex: 0.7,
    marginRight: 5,
    marginTop: 5,
    alignItems: 'flex-end',
  },
  statusCircleContainer: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 10,
    maxWidth: '90%',
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountContainer: {
    width: '100%',
    flex: 0.3,
    backgroundColor: '#00000095',
    justifyContent: 'space-evenly',
  },
});

export default DeclarationGallery;
