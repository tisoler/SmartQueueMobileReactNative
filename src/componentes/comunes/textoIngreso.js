// @flow
import React from 'react';
import {
  StyleSheet, TextInput, View
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    width: '75%',
    marginBottom: 15,
    height: 50
  },
  contenedorTexto: {
    width: '91%',
    marginLeft: 7,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    borderRadius: 7
  },
  cajaTexto: {
    color: '#fff',
    fontSize: 20,
    height: 65,
    lineHeight: 65,
    marginLeft: 5,
    width: '85%'
  },
  contenedorIcono: {
    height: 70,
    paddingTop: 20,
  }
});

type Props = {
  manejadorClick?: Function,
  placeholderText: string,
  manejadorCambioTexto: Function,
  value: string,
  soloLectura?: boolean,
  esconderTexto?: boolean,
  icono?: string | null,
  esNumerico?: boolean,
  largoMaximo?: number
}

const TextoIngreso = (props: Props) => {
  const {
    manejadorClick = null,
    placeholderText,
    manejadorCambioTexto,
    value,
    soloLectura = false,
    esconderTexto = false,
    icono = null,
    esNumerico = false,
    largoMaximo = 150
  } = props;
  return (
    <View style={estilos.contenedor}>
      { icono && (
        <View style={estilos.contenedorIcono}>
          <FontAwesomeIcon style={{ lineHeight: 70 }} size={30} fill="#fff" icon={icono} />
        </View>
      )}
      <View style={estilos.contenedorTexto}>
        <TextInput
          style={estilos.cajaTexto}
          placeholder={placeholderText}
          underlineColorAndroid="transparent"
          onChangeText={text => manejadorCambioTexto(!esNumerico ? text : text.replace(/[^0-9]/g, ''))}
          value={value}
          editable={!soloLectura}
          secureTextEntry={esconderTexto}
          onTouchStart={manejadorClick}
          placeholderTextColor="#B0E1F0"
          keyboardType={!esNumerico ? 'default' : 'numeric'}
          maxLength={largoMaximo}
        />
      </View>
    </View>
  );
};

TextoIngreso.defaultProps = {
  manejadorClick: null,
  esconderTexto: false,
  soloLectura: false,
  icono: null,
  esNumerico: false,
  largoMaximo: 150
};

export default TextoIngreso;
