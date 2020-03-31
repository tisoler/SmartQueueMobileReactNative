import React from 'react';
import Navegacion from './src/componentes/navegacion';
import { ContextoStatesProvider } from './src/lib/contextoStates';


export default function App() {
  return (
    <ContextoStatesProvider>
      <Navegacion/>
    </ContextoStatesProvider>
  );
}

