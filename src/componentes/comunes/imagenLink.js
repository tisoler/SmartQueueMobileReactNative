// @flow
import React from 'react';
import { StyleSheet, Image, Text } from 'react-native';
import { iconosCentros } from '../../lib/constantes';
import BotonRipple from './botonRipple';

const estilo = StyleSheet.create({
  imagen: {
    height: 150,
    width: 150
  },
  texto: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: 10
  }
});

type Props = {
  ManejadorClick: Function,
  AppIcon: string,
  Texto: string
}

const ImagenLink = (props: Props) => {
  const {
    ManejadorClick,
    AppIcon,
    Texto
  } = props;

  return (
    <BotonRipple
      ManejadorClick={ManejadorClick}
      height={150}
      width={150}
      colorBoton="#0084a8"
      amplitudEfecto={0.8}
      borderRadius={10}
    >
      <Image
        style={estilo.imagen}
        source={iconosCentros[AppIcon]}
      />
      <Text style={estilo.texto}>{Texto}</Text>
    </BotonRipple>
  );
};

export default ImagenLink;
