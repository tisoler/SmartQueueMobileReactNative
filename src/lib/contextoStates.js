// @flow
import * as React from 'react';
import { createContext, useReducer } from 'react';
import loginReducer from '../entidades/usuario/loginReducer';
import centroAtencionReducer from '../entidades/centroAtencion/centroAtencionReducer';

export const ContextoStates: Object = createContext();

type Props = {
  children: React.Element<any>
}

export const ContextoStatesProvider = (props: Props) => {
  const { children } = props;
  const [loginState, loginDispatch] = useReducer(loginReducer);
  const [centrosState, centrosDispatch] = useReducer(centroAtencionReducer);
  return (
    <ContextoStates.Provider value={{
      loginState, loginDispatch, centrosState, centrosDispatch
    }}
    >
      {children}
    </ContextoStates.Provider>
  );
};
