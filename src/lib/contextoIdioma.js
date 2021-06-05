// @flow
import * as React from 'react';
import { createContext, useContext } from 'react';
import { ContextoEstados } from './contextoEstados';
import textos from './textosIdiomas';

export const ContextoIdiomas: Object = createContext();

type Props = {
  children: React.Element<any>
};

export const ProveedorContextoIdiomas = (props: Props) => {
  const { children } = props;
  const { estadoIdiomaUsuario } = useContext(ContextoEstados);

  const textosGlobales = estadoIdiomaUsuario
    ? textos[estadoIdiomaUsuario]
    : textos.english;

  return (
    <ContextoIdiomas.Provider value={{ textosGlobales }}>
      {children}
    </ContextoIdiomas.Provider>
  );
};
