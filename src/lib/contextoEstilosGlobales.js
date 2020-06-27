// @flow
import * as React from 'react';
import { createContext, useContext } from 'react';
import { ContextoEstados } from './contextoEstados';
import temas from './temasEstilo';

export const ContextoEstilosGlobales: Object = createContext();

type Props = {
  children: React.Element<any>
};

export const ProveedorContextoEstilosGlobales = (props: Props) => {
  const { children } = props;
  const { estadoTemaUsuario } = useContext(ContextoEstados);
  const estilosGlobales = estadoTemaUsuario
    ? temas[estadoTemaUsuario]
    : temas.temaOscuro;

  return (
    <ContextoEstilosGlobales.Provider value={{ estilosGlobales }}>
      {children}
    </ContextoEstilosGlobales.Provider>
  );
};
