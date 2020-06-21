// @flow
import * as React from 'react';
import { createContext, useState } from 'react';
import {
  agregarTurnoActivoAccion,
  fijarTurnosAccion,
  fijarUsuarioLogueadoAccion,
  cancelarTurnoAccion,
  confirmarAsistenciaTurnoAccion,
  evaluarTurnoAccion,
  cambiarTemaUsuarioAccion
} from '../entidades/usuario/usuarioAcciones';
import fijarCentrosAccion from '../entidades/centroAtencion/centroAtencionAcciones';
import fijarTurnoActualAccion from '../entidades/turno/turnoAcciones';

export const ContextoEstados: Object = createContext();

type Props = {
  children: React.Element<any>
};

const estadoInicialLogin = {
  email: '',
  token: '',
  fbtoken: '',
  nombre: '',
  iniciales: ''
};
const temaUsuarioInicial = 'temaOscuro';

export const ProveedorContextoEstados = (props: Props) => {
  const { children } = props;
  const [estadoLogin, asignarEstadoLogin] = useState(estadoInicialLogin);
  const [estadoCentros, asignarEstadoCentros] = useState();
  const [estadoTurnosActivos, asignarEstadoTurnosActivos] = useState();
  const [estadoTurnoActual, asignarEstadoTurnoActual] = useState();
  const [
    estadoTurnosParaEvaluar,
    asignarEstadoTurnosParaEvaluar
  ] = useState();
  const [estadoTemaUsuario, asignarEstadoTemaUsuario] = useState(temaUsuarioInicial);

  // Interface contexto - acciones
  // Información usuario logueado
  const agregarTurnoActivoEnEstado = (turnoActivo: Object) => {
    agregarTurnoActivoAccion(estadoTurnosActivos, asignarEstadoTurnosActivos, turnoActivo);
  };
  const fijarTurnosEnEstado = (turnosUsuario: Array<Object>) => {
    fijarTurnosAccion(
      asignarEstadoTurnosActivos,
      asignarEstadoTurnosParaEvaluar,
      turnosUsuario
    );
  };
  const fijarUsuarioLogueadoEnEstado = (
    email: string,
    token: string,
    fbtoken: string,
    temaUsuario = 'temaOscuro'
  ) => {
    fijarUsuarioLogueadoAccion(
      email,
      token,
      fbtoken,
      temaUsuario,
      asignarEstadoLogin,
      asignarEstadoTemaUsuario,
    );
  };
  const cancelarTurnoEnEstado = (turno: Object) => {
    cancelarTurnoAccion(estadoTurnosActivos, asignarEstadoTurnosActivos, turno);
  };
  const confirmarAsistenciaTurnoEnEstado = (turno: Object) => {
    confirmarAsistenciaTurnoAccion(estadoTurnosActivos, asignarEstadoTurnosActivos, turno);
  };
  const evaluarTurnoEnEstado = (turno: Object) => {
    evaluarTurnoAccion(estadoTurnosParaEvaluar, asignarEstadoTurnosParaEvaluar, turno);
  };
  const cambiarTemaUsuarioEnEstado = () => {
    cambiarTemaUsuarioAccion(estadoTemaUsuario, asignarEstadoTemaUsuario);
  };
  // Centros
  const fijarCentrosEnEstado = (turno: Object) => {
    fijarCentrosAccion(estadoCentros, asignarEstadoCentros, turno);
  };
  // Turno
  const fijarTurnoActualEnEstado = (turno: Object, demora: Object) => {
    fijarTurnoActualAccion(asignarEstadoTurnoActual, turno, demora);
  };
  // Fin interface contexto - acciones

  return (
    <ContextoEstados.Provider value={{
      estadoLogin,
      estadoCentros,
      estadoTurnosActivos,
      estadoTurnosParaEvaluar,
      estadoTemaUsuario,
      estadoTurnoActual,
      agregarTurnoActivoEnEstado,
      fijarTurnosEnEstado,
      fijarUsuarioLogueadoEnEstado,
      cancelarTurnoEnEstado,
      confirmarAsistenciaTurnoEnEstado,
      evaluarTurnoEnEstado,
      fijarCentrosEnEstado,
      cambiarTemaUsuarioEnEstado,
      fijarTurnoActualEnEstado
    }}
    >
      {children}
    </ContextoEstados.Provider>
  );
};
