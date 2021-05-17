
// @flow
import * as React from 'react';
import { useContext } from 'react';
import { Svg, Path } from 'react-native-svg';
import { ContextoEstilosGlobales } from '../../../lib/contextoEstilosGlobales';

type Props = {
  width?: number,
  height?: number,
  color?: string,
}

export default (props: Props) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const {
    height = 40, width = 40, color = estilosGlobales.colorIconos,
  } = props;

  return (
    <Svg viewBox="0 0 25 25" width={width} height={height} fill={color}>
      <Path d="M15.5,25h-6a.5.5,0,0,1-.5-.5V19H8.25L8,19V20.5a.5.5,0,0,1-.5.5h-5a.5.5,0,0,1-.5-.5V15H1.24A1.25,1.25,0,0,1,0,13.75v-3.5A4.26,4.26,0,0,1,3.19,6.13a3.5,3.5,0,1,1,4.61,0,4.22,4.22,0,0,1,1.3.58,3.5,3.5,0,0,1,6.82,0,4.2,4.2,0,0,1,1.29-.58,3.5,3.5,0,1,1,4.61,0A4.26,4.26,0,0,1,25,10.25v3.5A1.25,1.25,0,0,1,23.75,15H23v5.5a.5.5,0,0,1-.5.5h-5a.5.5,0,0,1-.5-.5V19l-.25,0H16v5.5A.5.5,0,0,1,15.5,25ZM10,24h5V18.5a.5.5,0,0,1,.5-.5h1.25a.25.25,0,0,0,.25-.25v-3.5A3.25,3.25,0,0,0,13.75,11h-2.5A3.25,3.25,0,0,0,8,14.25v3.5a.25.25,0,0,0,.25.25H9.5a.5.5,0,0,1,.5.5Zm8-4h4V14.5a.5.5,0,0,1,.5-.5h1.25a.26.26,0,0,0,.25-.25v-3.5A3.25,3.25,0,0,0,20.75,7h-2.5A3.21,3.21,0,0,0,16,7.95a3.5,3.5,0,0,1-1.17,2.18A4.26,4.26,0,0,1,18,14.25ZM3,20H7V14.25a4.26,4.26,0,0,1,3.2-4.12A3.5,3.5,0,0,1,9,8,3.21,3.21,0,0,0,6.74,7H4.24A3.25,3.25,0,0,0,1,10.25v3.5a.25.25,0,0,0,.24.25H2.5a.5.5,0,0,1,.5.5Zm9.5-10A2.5,2.5,0,1,0,10,7.5,2.5,2.5,0,0,0,12.5,10Zm7-4A2.5,2.5,0,1,0,17,3.5,2.5,2.5,0,0,0,19.5,6Zm-14,0A2.5,2.5,0,1,0,3,3.5,2.5,2.5,0,0,0,5.49,6Z" />
    </Svg>
  );
};
