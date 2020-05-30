// @flow
import React from 'react';
import Navegador from './src/componentes/navegacion';
import { ContextoStatesProveedor } from './src/lib/contextoStates';
import { ContextoEstilosGlobalesProveedor } from './src/lib/contextoEstilosGlobales';

export default function App() {
  return (
    <ContextoStatesProveedor>
      <ContextoEstilosGlobalesProveedor>
        <Navegador />
      </ContextoEstilosGlobalesProveedor>
    </ContextoStatesProveedor>
  );
}
