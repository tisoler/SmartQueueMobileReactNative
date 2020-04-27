// @flow
import React from 'react';
import {
  StyleSheet, Text, ActivityIndicator
} from 'react-native';
import BotonRipple from './botonRipple';

const estilos = StyleSheet.create({
  actividad: {
    height: 55,
    zIndex: 2
  },
  texto: {
    lineHeight: 55,
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

type Props = {
  ManejadorClick: Function,
  Color: string,
  Cargando: boolean,
  children: string
};

const BotonRedondeado = (props: Props) => {
  const {
    ManejadorClick,
    Color,
    Cargando,
    children
  } = props;
  const boton = {
    marginTop: 20
  };

  return (
    <BotonRipple
      height={55}
      width="75%"
      style={boton}
      ManejadorClick={ManejadorClick}
      borderRadius={30}
      colorEfecto="#005f79"
      colorBoton={Color}
      estilo={boton}
      maxOpacity={0.42}
    >
      {Cargando
        ? <ActivityIndicator style={estilos.actividad} size="large" color="#0084a8" />
        : <Text style={estilos.texto}>{children}</Text>}
    </BotonRipple>
  );
};

export default BotonRedondeado;
