// @flow
import * as React from 'react';
import { createContext, useContext } from 'react';
import { ContextoEstados } from './contextoEstados';
import temas from './temasEstilo';

export const ContextoEstilosGlobales: Object = createContext();

type Props = {
  children: React.Element<any>
};

export const ContextoEstilosGlobalesProveedor = (props: Props) => {
  const { children } = props;
  const { estadoLogin } = useContext(ContextoEstados);
  const estilosGlobales = estadoLogin?.temaUsuario
    ? temas[estadoLogin.temaUsuario]
    : temas.temaOscuro;

  return (
    <ContextoEstilosGlobales.Provider value={{ estilosGlobales }}>
      {children}
    </ContextoEstilosGlobales.Provider>
  );
};
