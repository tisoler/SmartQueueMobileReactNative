// @flow
import React from 'react';
import Navegador from './src/componentes/navegacion';
import { ProveedorContextoEstados } from './src/lib/contextoEstados';
import { ContextoEstilosGlobalesProveedor } from './src/lib/contextoEstilosGlobales';

export default function App() {
  return (
    <ProveedorContextoEstados>
      <ContextoEstilosGlobalesProveedor>
        <Navegador />
      </ContextoEstilosGlobalesProveedor>
    </ProveedorContextoEstados>
  );
}
