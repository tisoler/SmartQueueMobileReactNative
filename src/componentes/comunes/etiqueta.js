// @flow
import React, { useContext, useState } from 'react';
import {
  StyleSheet, TextInput, View, TouchableOpacity
} from 'react-native';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import IconosGenerales from '../../lib/iconos';
import { NombresIconosGenerales } from '../../lib/constantes';

type Props = {
  value: string,
  puedeEsconderTexto?: boolean,
  icono?: string | null,
  color?: string,
  tamanoLetra?: number
}

export default (props: Props) => {
  const {
    value,
    puedeEsconderTexto = false,
    icono = null,
    color,
    tamanoLetra
  } = props;

  const [esconderTexto, cambiarEsconderTexto] = useState(puedeEsconderTexto);
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);

  const estilos = StyleSheet.create({
    contenedor: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      marginLeft: 10,
      height: 50
    },
    contenedorIcono: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 30,
      height: 50,
      paddingTop: icono === NombresIconosGenerales.dni ? 10 : 0
    },
    etiqueta: {
      color: color || estilosGlobales.colorLetraEncabezado,
      fontSize: tamanoLetra || estilosGlobales.tamanoLetraEtiqueta,
      width: !puedeEsconderTexto ? '82%' : 'auto',
      marginLeft: 12
    },
    iconoOjo: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      width: 50
    }
  });

  return (
    <View style={estilos.contenedor}>
      {icono && (
        <View style={estilos.contenedorIcono}>
          {IconosGenerales[icono]}
        </View>
      )}
      <TextInput style={estilos.etiqueta} editable={false} secureTextEntry={esconderTexto}>
        {value}
      </TextInput>
      {puedeEsconderTexto && (
        <TouchableOpacity
          style={estilos.iconoOjo}
          onPress={() => cambiarEsconderTexto(!esconderTexto)}
        >
          {IconosGenerales[NombresIconosGenerales.ojo](esconderTexto)}
        </TouchableOpacity>
      )}
    </View>
  );
};
