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
  deshabilitado?: boolean
};

const BotonRedondeado = (props: Props) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const {
    manejadorClick,
    colorBorde = estilosGlobales.colorBordeBotonPrincipal,
    colorFondo = estilosGlobales.colorFondoBotonPrincipal,
    cargando = false,
    children,
    colorEfecto = estilosGlobales.colorEfectoClickBotonPrincipal,
    estilo = {},
    deshabilitado = false
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
      fontSize: 18,
      fontWeight: 'bold',
      color: estilosGlobales.colorTextoGeneral
    }
  });

  return (
    <BotonRipple
      height={59}
      width="85%"
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
