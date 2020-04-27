// @flow
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

const styles = StyleSheet.create({
  ingresos: {
    width: '75%',
    backgroundColor: '#fff',
    borderColor: 'white',
    borderWidth: 0,
    borderRadius: 30,
    fontSize: 20,
    height: 50,
    paddingLeft: 5,
    marginBottom: 20
  }
});

type Props = {
  ManejadorClick?: Function,
  PlaceholderText: string,
  ManejadorCambioTexto: Function,
  Value: string,
  SoloLectura: boolean,
  EsconderTexto?: boolean
}

const TextoIngreso = (props: Props) => {
  const {
    ManejadorClick = null,
    PlaceholderText,
    ManejadorCambioTexto,
    Value,
    SoloLectura,
    EsconderTexto = false
  } = props;
  return (
    <TextInput
      style={styles.ingresos}
      placeholder={PlaceholderText}
      underlineColorAndroid="transparent"
      onChangeText={text => ManejadorCambioTexto(text)}
      value={Value}
      editable={!SoloLectura}
      secureTextEntry={EsconderTexto}
      onTouchStart={ManejadorClick}
    />
  );
};

TextoIngreso.defaultProps = {
  ManejadorClick: null,
  EsconderTexto: false
};

export default TextoIngreso;
