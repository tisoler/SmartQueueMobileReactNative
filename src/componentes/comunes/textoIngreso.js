// @flow
import React, { useState } from 'react';
import {
  StyleSheet, TextInput, View, TouchableOpacity
} from 'react-native';
import IconosGenerales from '../../lib/iconos';
import { NombresIconosGenerales } from '../../lib/constantes';


type Props = {
  manejadorClick?: Function,
  placeholderText: string,
  manejadorCambioTexto: Function,
  value: string,
  soloLectura?: boolean,
  puedeEsconderTexto?: boolean,
  icono?: string | null,
  largoMaximo?: number,
  tipoDeTeclado?: string,
  sinPrimeraLetraMayuscula?: boolean
}

export default (props: Props) => {
  const {
    manejadorClick = null,
    placeholderText,
    manejadorCambioTexto,
    value,
    soloLectura = false,
    puedeEsconderTexto = false,
    icono = null,
    largoMaximo = 150,
    tipoDeTeclado = 'default',
    sinPrimeraLetraMayuscula = false
  } = props;

  const [esconderTexto, cambiarEsconderTexto] = useState(puedeEsconderTexto);

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
      alignItems: 'flex-end',
      width: '100%',
      height: 55,
      marginLeft: 7,
      borderRadius: 7,
      borderBottomColor: '#fff',
      borderBottomWidth: 1
    },
    cajaTexto: {
      color: '#fff',
      fontSize: 20,
      height: 55,
      lineHeight: 30,
      width: !puedeEsconderTexto ? '100%' : '77%',
      paddingBottom: 0
    },
    contenedorIcono: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 30,
      height: 60,
      paddingTop: icono === NombresIconosGenerales.dni ? 15 : 0
    },
    iconoOjo: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 55,
      width: 50,
      marginLeft: 15
    }
  });

  return (
    <View style={estilos.contenedor}>
      { icono && (
        <View style={estilos.contenedorIcono}>
          { IconosGenerales[icono] }
        </View>
      )}
      <View style={estilos.contenedorTexto}>
        <TextInput
          style={estilos.cajaTexto}
          placeholder={placeholderText}
          underlineColorAndroid="transparent"
          onChangeText={text => manejadorCambioTexto(!tipoDeTeclado !== 'numeric' ? text : text?.replace(/[^0-9]/g, ''))}
          value={value}
          editable={!soloLectura}
          secureTextEntry={esconderTexto}
          onTouchStart={manejadorClick}
          placeholderTextColor="#B5B7B7"
          keyboardType={tipoDeTeclado}
          maxLength={largoMaximo}
          autoCapitalize={!sinPrimeraLetraMayuscula && !puedeEsconderTexto ? 'words' : 'none'}
        />
        {puedeEsconderTexto && (
          <TouchableOpacity
            style={estilos.iconoOjo}
            onPress={() => cambiarEsconderTexto(!esconderTexto)}
          >
            {IconosGenerales[NombresIconosGenerales.ojo](esconderTexto)}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
