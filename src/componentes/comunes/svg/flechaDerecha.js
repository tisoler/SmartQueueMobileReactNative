// @flow
import * as React from 'react';
import { useContext } from 'react';
import { Svg, Polygon } from 'react-native-svg';
import { ContextoEstilosGlobales } from '../../../lib/contextoEstilosGlobales';

type Props = {
  width?: number,
  height?: number
}

export default (props: Props) => {
  const {
    height = 20, width = 20
  } = props;
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);

  return (
    <Svg width={width} height={height} viewBox="0 0 407.436 407.436" fill={estilosGlobales.colorIconos}>
      <Polygon points="112.814,0 91.566,21.178 273.512,203.718 91.566,386.258 112.814,407.436 315.869,203.718" />
    </Svg>
  );
};
