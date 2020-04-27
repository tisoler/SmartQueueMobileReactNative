// @flow
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import BotonRipple from './botonRipple';

const estilos = StyleSheet.create({
  textoBoton: {
    textAlign: 'center',
    lineHeight: 80,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    height: 80,
    width: '100%'
  }
});

type Props = {
  height: number,
  width: number | string,
  Color: string,
  ManejadorClick: Function,
  children: string
};

const BotonPopup = (props: Props) => {
  const {
    height,
    width,
    Color,
    ManejadorClick,
    children
  } = props;

  return (
    <BotonRipple
      height={height}
      width={width}
      colorBoton={Color}
      ManejadorClick={ManejadorClick}
    >
      <Text style={estilos.textoBoton}>{children}</Text>
    </BotonRipple>
  );
};

export default BotonPopup;
