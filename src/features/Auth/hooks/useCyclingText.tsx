import React, {useState, useEffect, useRef} from 'react';
import {Animated} from 'react-native';

import {Typography} from '@src/components';
import {TypographyProps} from '@src/components/typography';

const useCyclingText = (
  texts: string[],
  cyclingSpeed: number,
  style?: Omit<TypographyProps, 'text'>,
) => {
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
      <Animated.View style={{opacity: fade}}>
        <Typography variant="b1" {...style} text={texts[currentIndex]} />
      </Animated.View>
    );
  };

  return [texts[currentIndex], typographyFadeComponent()];
};

export default useCyclingText;
