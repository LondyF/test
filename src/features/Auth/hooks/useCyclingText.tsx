import React, {useState, useEffect, useRef} from 'react';
import {Animated} from 'react-native';

import {Typography} from '@src/components';
import {TypographyProps} from '@src/components/typography';

type UseCyclingTextOptions = Omit<TypographyProps, 'text'> & {
  fullWidth?: boolean;
};

const useCyclingText = (
  texts: string[],
  cyclingSpeed: number,
  style?: UseCyclingTextOptions,
) => {
  const {fullWidth, ...typographyProps} = style ?? {};
  const [currentIndex, setCurrentIndex] = useState(0);

  let fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(currIndex => {
          const nextIndex = currIndex + 1;

          return nextIndex > texts.length - 1 ? 0 : nextIndex;
        });

        fadeIn();
      });
    }, cyclingSpeed);

    return () => {
      clearInterval(interval);
    };
  });

  const fadeIn = () => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const typographyFadeComponent = () => {
    return (
      <Animated.View style={[{opacity: fade}, fullWidth && {width: '100%'}]}>
        <Typography variant="b1" {...typographyProps} text={texts[currentIndex]} />
      </Animated.View>
    );
  };

  return [texts[currentIndex], typographyFadeComponent()];
};

export default useCyclingText;
