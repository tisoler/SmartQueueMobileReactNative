// @flow
import React, { useState, useContext } from 'react';
import {
  StyleSheet, TextInput, View, TouchableOpacity
} from 'react-native';
import IconosGenerales from '../../lib/iconos';
import { NombresIconosGenerales } from '../../lib/constantes';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';


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
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);

  const estilos = StyleSheet.create({
    contenedor: {
      flexDirection: 'row',
      width: '90%',
      height: 50,
      alignItems: 'center',
    },
    contenedorTexto: {
      flex: 1,
      flexDirection: 'row',
      height: 55,
      borderRadius: 7,
      borderBottomColor: '#DDD',
      borderBottomWidth: 1,
    },
    cajaTexto: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: estilosGlobales.tallaFuenteCajaTexto,
      height: 55,
      lineHeight: 30,
      width: !puedeEsconderTexto ? '100%' : '77%',
      paddingBottom: 0,
      borderBottomColor: '#DDD',
      bottom: -5,
    },
    contenedorIcono: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 60,
      paddingTop: icono === NombresIconosGenerales.dni ? 15 : 0,
      right: 3,
      backgroundColor: 'green',
    },
    iconoOjo: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 55,
      marginLeft: 15,
      bottom: -7,
    }
  });

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.contenedorTexto}>
        <TextInput
          style={estilos.cajaTexto}
          placeholder={placeholderText}
          underlineColorAndroid="transparent"
          onChangeText={texto => manejadorCambioTexto(!tipoDeTeclado !== 'numeric' ? texto : texto?.replace(/[^0-9]/g, ''))}
          value={value}
          editable={!soloLectura}
          secureTextEntry={esconderTexto}
          onTouchStart={manejadorClick}
          placeholderTextColor="#999999"
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
      { icono && (
        <View style={estilos.contenedorIcono}>
          { IconosGenerales[icono] }
        </View>
      )}
    </View>
  );
};
