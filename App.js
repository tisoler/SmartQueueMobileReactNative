// @flow
import React from 'react';
import Navegador from './src/componentes/navegacion';
import { ContextoStatesProvider } from './src/lib/contextoStates';

export default function App() {
  return (
    <ContextoStatesProvider>
      <Navegador />
    </ContextoStatesProvider>
  );
}
