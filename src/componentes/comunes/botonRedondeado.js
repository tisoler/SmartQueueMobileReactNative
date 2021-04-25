// @flow
import React, { useContext } from 'react';
import {
  StyleSheet, Text, ActivityIndicator
} from 'react-native';
import BotonRipple from './botonRipple';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';

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
    width = "85%",
    height = 59,
    colorTexto = estilosGlobales.colorTextoBotonPrincipal,
  } = props;

  const estilos = StyleSheet.create({
    actividad: {
      height: 55,
      zIndex: 2
    },
    texto: {
      lineHeight: 55,
      width: '100%',
      textAlign: 'center',
      fontSize: estilosGlobales.tallaFuenteBoton,
      fontWeight: 'bold',
      color: colorTexto
    }
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
      {cargando
        ? <ActivityIndicator style={estilos.actividad} size="large" color="white" />
        : <Text style={estilos.texto}>{children}</Text>}
    </BotonRipple>
  );
};

export default BotonRedondeado;
