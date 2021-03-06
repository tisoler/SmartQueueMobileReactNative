// @flow
import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  width?: number,
  height?: number
}

export default (props: Props) => {
  const {
    height = 40, width = 40
  } = props;

  const estilo = {
    transform: ([{ scaleY: -1 }, { scaleX: 1 }]),
    marginBottom: 24
  };

  return (
    <Svg viewBox="-29 -16 47.5 47.5" width={width} height={height} fill="#ffffff" style={estilo}>
      <Path d="m 0,0 c 0.526,1.179 0.744,2.542 0.744,3.969 0,3.689 -1.954,7.131 -5.829,7.131 -3.876,0 -5.83,-3.379 -5.83,-7.131 0,-3.782 1.892,-7.132 5.83,-7.132 0.712,0 1.364,0.094 1.983,0.218 l -1.115,1.085 c -0.342,0.31 -0.59,0.806 -0.59,1.24 0,1.209 0.838,2.232 2.109,2.232 0.434,0 0.805,-0.155 1.178,-0.403 L 0,0 Z m 0.371,-6.077 c -1.519,-0.868 -3.348,-1.364 -5.456,-1.364 -6.295,0 -10.666,4.992 -10.666,11.41 0,6.449 4.34,11.41 10.666,11.41 6.231,0 10.665,-5.116 10.665,-11.41 0,-2.729 -0.713,-5.209 -2.078,-7.162 l 1.768,-1.52 c 0.589,-0.527 1.085,-1.023 1.085,-1.891 0,-1.085 -1.085,-1.954 -2.138,-1.954 -0.684,0 -1.24,0.28 -2.078,0.993 l -1.768,1.488 z" />
    </Svg>
  );
};
