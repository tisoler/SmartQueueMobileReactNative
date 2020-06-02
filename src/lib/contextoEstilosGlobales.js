// @flow
import * as React from 'react';
import { createContext } from 'react';

export const ContextoEstilosGlobales: Object = createContext();

type Props = {
  children: React.Element<any>
};

export const ContextoEstilosGlobalesProveedor = (props: Props) => {
  const { children } = props;
  const estilosGlobales = {
    colorBarraNavegacion: '#0A5164',
    colorFondoPantallaLogin: '#026F8E',
    colorFondoGlobal: '#2A4D57',
    colorFondoEncabezadoTitulos: '#00566D',
    colorFondoContenedorDatos: '#005f79',
    colorTextoGeneral: '#fff',
    mensajeError: {
      color: '#852E1D',
      fontSize: 17
    },
    tituloSeccion: {
      fontSize: 20.5,
      color: '#FFF',
      lineHeight: 50
    },
    textoAviso: {
      fontSize: 21,
      color: '#fff',
      margin: 20,
      textAlign: 'center'
    },
    tituloGrande: {
      fontSize: 26,
      color: '#fff',
      fontWeight: 'bold'
    },
    subtituloGrande: {
      fontSize: 22,
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    colorFondoBotonPrincipal: '#16817a',
    colorBordeBotonPrincipal: '#16817a',
    colorEfectoClickBotonPrincipal: '#005f79',
    colorFondoBotonSecundario: '#005f79',
    colorBordeBotonSecundario: '#005f79',
    colorEfectoClickBotonSecundario: '#fff',
    imagenLogoCentro: {
      height: 150,
      width: 150
    }
  };

  return (
    <ContextoEstilosGlobales.Provider value={{ estilosGlobales }}>
      {children}
    </ContextoEstilosGlobales.Provider>
  );
};
