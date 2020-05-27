// @flow
import React from 'react';
import {
  StyleSheet, TextInput, View
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    width: '80%',
    marginBottom: 15,
    height: 50
  },
  contenedorTexto: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 7,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    borderRadius: 7
  },
  cajaTexto: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 30,
    height: 60,
    marginLeft: 5,
    width: '100%'
  },
  contenedorIcono: {
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
          placeholderTextColor="#B5B7B7"
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
