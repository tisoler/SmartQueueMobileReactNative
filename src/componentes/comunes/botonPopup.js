// @flow
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import BotonRipple from './botonRipple';

type Props = {
  height: number,
  width: number | string,
  colorFondo: string,
  manejadorClick: Function,
  children: string
};

const BotonPopup = (props: Props) => {
  const {
    height,
    width,
    colorFondo,
    manejadorClick,
    children
  } = props;

  const estilos = StyleSheet.create({
    textoBoton: {
      textAlign: 'center',
      lineHeight: height,
      fontSize: 22,
      color: '#fff',
      height,
      width: '100%'
    }
  });

  return (
    <BotonRipple
      height={height}
      width={width}
      colorFondo={colorFondo}
      colorBorde={colorFondo}
      manejadorClick={manejadorClick}
      borderRadius={0}
    >
      <Text style={estilos.textoBoton}>{children}</Text>
    </BotonRipple>
  );
};

export default BotonPopup;
