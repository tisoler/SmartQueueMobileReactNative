// @flow
import React, { useContext } from 'react';
import {
  StyleSheet, Text, View
} from 'react-native';
import IconosGenerales from '../../lib/iconos';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';

type Props = {
  value: string,
  esconderTexto?: boolean,
  icono?: string | null,
  color?: string,
  tamanoLetra?: number
}

const Etiqueta = (props: Props) => {
  const {
    value,
    esconderTexto = false,
    icono = null,
    color,
    tamanoLetra
  } = props;

  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const estilos = StyleSheet.create({
    contenedor: {
      flexDirection: 'row',
      width: '80%',
      margin: 10
    },
    etiqueta: {
      color: color || estilosGlobales.colorLetraEncabezado,
      fontSize: tamanoLetra || estilosGlobales.tamanoLetraEtiqueta,
      width: '90%',
      marginLeft: 12
    }
  });

  return (
    <View style={estilos.contenedor}>
      {icono && (
        IconosGenerales[icono]
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
