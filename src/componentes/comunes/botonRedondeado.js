// @flow
import React, { useContext } from 'react';
import {
  StyleSheet, Text, ActivityIndicator, View
} from 'react-native';
import BotonRipple from './botonRipple';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import FlechaDerecha from './svg/flechaDerecha';

type Props = {
  manejadorClick: Function,
  colorBorde?: string,
  colorFondo?: string,
  cargando?: boolean,
  children: string,
  colorEfecto?: string,
  estilo?: Object,
  deshabilitado?: boolean,
  width?: string,
  height?: number,
  colorTexto?: String,
  flechaAlFinal?: boolean,
};

const BotonRedondeado = (props: Props) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const {
    manejadorClick,
    colorBorde,
    colorFondo,
    cargando = false,
    children,
    colorEfecto,
    estilo = {},
    deshabilitado = false,
    width = '85%',
    height = 59,
    colorTexto = estilosGlobales.colorTextoBotonPrincipal,
    flechaAlFinal = false,
  } = props;

  const estilos = StyleSheet.create({
    contenedor: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    actividad: {
      height: 55,
      zIndex: 2
    },
    texto: {
      lineHeight: 55,
      width: '50%',
      textAlign: 'center',
      fontSize: estilosGlobales.tallaFuenteBoton,
      fontWeight: 'bold',
      color: colorTexto,
    },
    contenedorflecha: {
      position: 'absolute',
      right: 10,
    },
  });

  return (
    <BotonRipple
      height={height}
      width={width}
      manejadorClick={manejadorClick}
      colorEfecto={colorEfecto}
      colorFondo={colorFondo}
      colorBorde={colorBorde}
      estilo={estilo}
      maxOpacity={0.42}
      deshabilitado={deshabilitado || cargando}
    >
      <View style={estilos.contenedor}>
        {cargando
          ? <ActivityIndicator style={estilos.actividad} size="large" color="white" />
          : <Text style={estilos.texto}>{children}</Text>}
        {flechaAlFinal && (
          <View style={estilos.contenedorflecha}>
            <FlechaDerecha />
          </View>
        )}
      </View>
    </BotonRipple>
  );
};

export default BotonRedondeado;
