
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
    <Svg viewBox="-60 -120 512 512" width={width} height={height} fill={estilosGlobales.colorIconos}>
      <Path d="m368 154.667969h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
      <Path d="m368 32h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
      <Path d="m368 277.332031h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0" />
    </Svg>
  );
};
