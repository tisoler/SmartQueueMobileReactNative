// @flow
import * as React from 'react';
import { createContext, useState } from 'react';
import {
  agregarTurnoActivoAccion,
  fijarTurnosActivosAccion,
  fijarUsuarioLogueadoAccion,
  cancelarTurnoAccion,
  confirmarAsistenciaTurnoAccion,
  evaluarTurnoAccion
} from '../entidades/usuario/usuarioAcciones';
import fijarCentrosAccion from '../entidades/centroAtencion/centroAtencionAcciones';

export const ContextoEstados: Object = createContext();

type Props = {
  children: React.Element<any>
};

const estadoInicialLogin = {
  email: '',
  token: '',
  turnosActivos: [],
  turnosParaEvaluar: []
};

const estadoCentrosInicial = {
  centros: [],
  centroSeleccionado: []
};

export const ProveedorContextoEstados = (props: Props) => {
  const { children } = props;
  const [estadoLogin, asignarEstadoLogin] = useState(estadoInicialLogin);
  const [estadoCentros, asignarEstadoCentros] = useState(estadoCentrosInicial);

  // Interface contexto - acciones
  // Información usuario logueado
  const agregarTurnoActivoEnEstado = (turnoActivo: Object) => {
    agregarTurnoActivoAccion(estadoLogin, asignarEstadoLogin, turnoActivo);
  };
  const fijarTurnosActivosEnEstado = (turnosUsuario: Array<Object>) => {
    fijarTurnosActivosAccion(estadoLogin, asignarEstadoLogin, turnosUsuario);
  };
  const fijarUsuarioLogueadoEnEstado = (email: string, token: string, contrasena: string) => {
    fijarUsuarioLogueadoAccion(asignarEstadoLogin, email, token, contrasena);
  };
  const cancelarTurnoEnEstado = (turno: Object) => {
    cancelarTurnoAccion(estadoLogin, asignarEstadoLogin, turno);
  };
  const confirmarAsistenciaTurnoEnEstado = (turno: Object) => {
    confirmarAsistenciaTurnoAccion(estadoLogin, asignarEstadoLogin, turno);
  };
  const evaluarTurnoEnEstado = (turno: Object) => {
    evaluarTurnoAccion(estadoLogin, asignarEstadoLogin, turno);
  };
  // Centros
  const fijarCentrosEnEstado = (turno: Object) => {
    fijarCentrosAccion(estadoCentros, asignarEstadoCentros, turno);
  };
  // Fin interface contexto - acciones

  return (
    <ContextoEstados.Provider value={{
      estadoLogin,
      estadoCentros,
      agregarTurnoActivoEnEstado,
      fijarTurnosActivosEnEstado,
      fijarUsuarioLogueadoEnEstado,
      cancelarTurnoEnEstado,
      confirmarAsistenciaTurnoEnEstado,
      evaluarTurnoEnEstado,
      fijarCentrosEnEstado
    }}
    >
      {children}
    </ContextoEstados.Provider>
  );
};
