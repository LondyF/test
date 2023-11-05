import React from 'react';
import {View, StyleSheet} from 'react-native';

import {StackedAreaChart, BarChart, Grid} from 'react-native-svg-charts';
import * as shape from 'd3-shape';

const ChartTest: React.FC = () => {
  const data = [
    {
      month: new Date(2015, 0, 1),
      apples: 3840,
      bananas: 1920,
      cherries: 960,
      dates: 400,
    },
    {
      month: new Date(2015, 1, 1),
      apples: 1600,
      bananas: 1440,
      cherries: 960,
      dates: 400,
    },
    {
      month: new Date(2015, 2, 1),
      apples: 640,
      bananas: 960,
      cherries: 3640,
      dates: 400,
    },
    {
      month: new Date(2015, 3, 1),
      apples: 3320,
      bananas: 480,
      cherries: 640,
      dates: 400,
    },
  ];

  const colors = ['#8800cc', '#aa00ff', '#cc66ff', '#eeccff'];
  const keys = ['apples', 'bananas', 'cherries', 'dates'];
  const svgs = [
    {onPress: () => console.log('apples')},
    {onPress: () => console.log('bananas')},
    {onPress: () => console.log('cherries')},
    {onPress: () => console.log('dates')},
  ];

  const fill = 'rgb(134, 65, 244)';
  const data2 = [
    50,
    10,
    40,
    95,
    -4,
    -24,
    null,
    85,
    undefined,
    0,
    35,
    53,
    -53,
    24,
    50,
    -20,
    -80,
  ];

  return (
    <View>
      <StackedAreaChart
        style={{height: 200, paddingVertical: 16}}
        data={data}
        keys={keys}
        colors={colors}
        curve={shape.curveNatural}
        showGrid={false}
        svgs={svgs}
      />
      <BarChart
        style={{height: 200}}
        data={data2}
        svg={{fill}}
        contentInset={{top: 30, bottom: 30}}>
        <Grid />
      </BarChart>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ChartTest;
