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
    height = 40, width = 40, color = estilosGlobales.colorIconos
  } = props;

  return (
    <Svg viewBox="0 0 128 128" width={width} height={height} fill={color}>
      <Path d="m121.5 64c1 0 1.7-.8 1.8-1.7v-21.8c0-1-.8-1.7-1.8-1.8h-4.8l-2.1-14.3c-.1-1-1-1.6-2-1.5l-27.1 4h-.1l-79.2 11.9s-1.5.3-1.5 1.7v21.7c0 1 .8 1.7 1.7 1.8 4.4 0 7.9 3.5 7.9 7.9s-3.5 7.9-7.9 7.9c-1 0-1.7.8-1.8 1.7v21.7c0 1 .8 1.7 1.8 1.8h115c1 0 1.7-.8 1.8-1.8v-21.6c0-1-.8-1.7-1.7-1.8-4.4 0-7.9-3.5-7.9-7.9s3.5-7.9 7.9-7.9zm-37.3-33.3.7 4.7c.1.9.9 1.5 1.7 1.5h.3c1-.1 1.6-1 1.5-2l-.7-4.7 23.7-3.5 1.8 12.1h-83.1zm35.6 52.5v18.4h-25.9v-4.8c0-1-.8-1.8-1.8-1.8s-1.8.8-1.8 1.8v4.8h-82v-18.4c6.2-1 10.5-6.8 9.5-13-.8-4.9-4.6-8.8-9.5-9.5v-18.4h82.1v4.7c0 1 .8 1.8 1.8 1.8s1.8-.8 1.8-1.8v-4.8h25.9v18.4c-6.2 1-10.5 6.8-9.5 13 .6 5 4.4 8.8 9.4 9.6z" />
      <Path d="m92.1 74.6c-1 0-1.7.8-1.8 1.7v11.6c0 1 .8 1.8 1.8 1.8s1.8-.8 1.8-1.8v-11.5c0-1-.8-1.8-1.8-1.8z" />
      <Path d="m92.1 54.2c-1 0-1.7.8-1.8 1.7v11.6c0 1 .8 1.8 1.8 1.8s1.8-.8 1.8-1.8v-11.6c0-.9-.8-1.7-1.8-1.7z" />
      <Path d="m27.3 57h21.7c1 0 1.8-.8 1.8-1.8s-.8-1.7-1.8-1.7h-21.7c-1 0-1.8.8-1.8 1.8s.8 1.7 1.8 1.7z" />
      <Path d="m70.7 64.6h-43.4c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8h43.4c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8z" />
      <Path d="m70.7 75.7h-43.4c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8h43.4c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8z" />
      <Path d="m70.7 86.8h-43.4c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8h43.4c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8z" />
    </Svg>
  );
};
