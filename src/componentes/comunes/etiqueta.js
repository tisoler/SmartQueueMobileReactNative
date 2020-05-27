// @flow
import React from 'react';
import {
  StyleSheet, Text, View
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    width: '80%',
    margin: 10
  },
  etiqueta: {
    color: '#fff',
    fontSize: 19,
    width: '90%',
    marginLeft: 12
  }
});

type Props = {
  value: string,
  esconderTexto?: boolean,
  icono?: string | null
}

const Etiqueta = (props: Props) => {
  const {
    value,
    esconderTexto = false,
    icono = null
  } = props;
  return (
    <View style={estilos.contenedor}>
      {icono && (
        <FontAwesomeIcon style={{ lineHeight: 70 }} size={30} fill="#fff" icon={icono} />
      )}
      <Text style={estilos.etiqueta} secureTextEntry={esconderTexto}>
        {value}
      </Text>
    </View>
  );
};

Etiqueta.defaultProps = {
  esconderTexto: false,
  icono: null
};

export default Etiqueta;
