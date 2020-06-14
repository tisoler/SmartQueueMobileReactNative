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
      <Path d="M238.933,0C106.974,0,0,106.974,0,238.933s106.974,238.933,238.933,238.933s238.933-106.974,238.933-238.933    C477.726,107.033,370.834,0.141,238.933,0z M238.933,443.733c-113.108,0-204.8-91.692-204.8-204.8s91.692-204.8,204.8-204.8    s204.8,91.692,204.8,204.8C443.611,351.991,351.991,443.611,238.933,443.733z" />
      <Path d="M370.046,141.534c-6.614-6.388-17.099-6.388-23.712,0v0L187.733,300.134l-56.201-56.201    c-6.548-6.78-17.353-6.967-24.132-0.419c-6.78,6.548-6.967,17.353-0.419,24.132c0.137,0.142,0.277,0.282,0.419,0.419    l68.267,68.267c6.664,6.663,17.468,6.663,24.132,0l170.667-170.667C377.014,158.886,376.826,148.082,370.046,141.534z" />
    </Svg>
  );
};