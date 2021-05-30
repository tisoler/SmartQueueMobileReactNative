// @flow
import * as React from 'react';
import { useContext } from 'react';
import { Svg, Polygon } from 'react-native-svg';
import { ContextoEstilosGlobales } from '../../../lib/contextoEstilosGlobales';

type Props = {
  width?: number,
  height?: number,
  color?: string,
}

export default (props: Props) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const {
    height = 20, width = 20, color = estilosGlobales.colorIconos,
  } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 407.436 407.436" fill={color}>
      <Polygon points="315.869,21.178 294.621,0 91.566,203.718 294.621,407.436 315.869,386.258 133.924,203.718 " />
    </Svg>
  );
};
