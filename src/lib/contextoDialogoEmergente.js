// @flow
import * as React from 'react';
import { createContext, useState } from 'react';

export const ContextoDialogoEmergente: Object = createContext();

type Props = {
  children: React.Element<any>
};

export const ProveedorContextoDialogoEmergente = (props: Props) => {
  const { children } = props;
  const [estadoDialogoEmergente, asignarEstadoDialogoEmergente] = useState(false);

  const abrirDialogoEmergente = (
    titulo: string,
    mensaje: string,
    textoBotonAfirmativo: string,
    textoBotonNegativo: string
  ) => new Promise((resolve, reject) => {
    asignarEstadoDialogoEmergente({
      titulo,
      mensaje,
      botones: [
        {
          texto: textoBotonAfirmativo,
          onPress: () => {
            asignarEstadoDialogoEmergente(null);
            resolve(true);
          }
        },
        {
          texto: textoBotonNegativo,
          onPress: () => {
            asignarEstadoDialogoEmergente(null);
            resolve(false);
          }
        }
      ]
    });
  });

  return (
    <ContextoDialogoEmergente.Provider
      value={{ estadoDialogoEmergente, abrirDialogoEmergente }}
    >
      {children}
    </ContextoDialogoEmergente.Provider>
  );
};
