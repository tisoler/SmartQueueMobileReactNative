// @flow
import * as React from 'react';
import { useContext } from 'react';
import { Svg, Path } from 'react-native-svg';
import { ContextoEstilosGlobales } from '../../../lib/contextoEstilosGlobales';

type Props = {
  width?: number,
  height?: number
}

export default (props: Props) => {
  const {
    height = 40, width = 40
  } = props;
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);

  return (
    <Svg viewBox="0 0 512 512" width={width} height={height} fill={estilosGlobales.colorIconos}>
      <Path d="M378.957,355.002l-98.937-98.937l98.937-98.937c6.768-6.899,6.768-17.184-0.001-23.953    c-6.769-6.769-17.054-6.769-23.953,0l-98.937,98.937l-98.937-98.937c-6.769-6.769-17.054-6.769-23.953,0    c-6.769,6.769-6.769,17.053,0,23.953l98.937,98.937l-98.936,98.937c-6.769,6.769-6.769,17.053,0,23.953    c3.385,3.385,6.769,5.077,11.977,5.077c5.077,0,8.592-1.692,11.977-5.077l98.937-98.937l98.937,98.937    c3.385,3.385,6.769,5.077,11.977,5.077c3.385,0,8.592-1.692,11.977-5.077C385.726,372.186,385.726,361.903,378.957,355.002z" />
    </Svg>
  );
};
