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
    fontWeight: 'bold',
    color: 'white'
  }
});

type Props = {
  manejadorClick: Function,
  colorBorde?: string,
  colorFondo?: string,
  cargando?: boolean,
  children: string,
  colorEfecto?: string
};

const BotonRedondeado = (props: Props) => {
  const {
    manejadorClick,
    colorBorde,
    colorFondo,
    cargando = false,
    children,
    colorEfecto = '#005f79'
  } = props;
  const boton = {
    marginTop: 20
  };

  return (
    <BotonRipple
      height={59}
      width="85%"
      style={boton}
      manejadorClick={manejadorClick}
      colorEfecto={colorEfecto}
      colorFondo={colorFondo}
      colorBorde={colorBorde}
      estilo={boton}
      maxOpacity={0.42}
    >
      {cargando
        ? <ActivityIndicator style={estilos.actividad} size="large" color="white" />
        : <Text style={estilos.texto}>{children}</Text>}
    </BotonRipple>
  );
};

BotonRedondeado.defaultProps = {
  colorFondo: '#0084a8',
  colorBorde: '#fff',
  cargando: false,
  colorEfecto: "#005f79"
};

export default BotonRedondeado;
