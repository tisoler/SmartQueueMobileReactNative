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
  cambiarTemaUsuarioAccion,
  cambiarTokenFirebaseAccion
} from '../entidades/usuario/usuarioAcciones';
import { fijarCentrosAccion, filtrarCentrosAccion } from '../entidades/centroAtencion/centroAtencionAcciones';
import fijarTurnoActualAccion from '../entidades/turno/turnoAcciones';

export const ContextoEstados: Object = createContext();

type Props = {
  children: React.Element<any>
};

const estadoInicialLogin = {
  email: '',
  token: '',
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
  const [estadoFbToken, asignarEstadoFbToken] = useState();
  const [estadoIrEvaluacion, asignarEstadoIrEvaluacion] = useState();

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
      asignarEstadoFbToken
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
  const cambiarTokenFirebaseEnEstado = (tokenFb: string) => {
    cambiarTokenFirebaseAccion(asignarEstadoFbToken, tokenFb);
  };
  // Centros
  const fijarCentrosEnEstado = (centros: Array<Object>) => {
    fijarCentrosAccion(asignarEstadoCentros, centros);
  };
  const filtrarCentrosEnEstado = (textoBusqueda: string) => {
    filtrarCentrosAccion(estadoCentros, asignarEstadoCentros, textoBusqueda);
  };
  // Turno
  const fijarTurnoActualEnEstado = (turno: Object, demora: Object, irHaciaTurno = false) => {
    fijarTurnoActualAccion(asignarEstadoTurnoActual, turno, demora, irHaciaTurno);
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
      estadoFbToken,
      estadoIrEvaluacion,
      agregarTurnoActivoEnEstado,
      fijarTurnosEnEstado,
      fijarUsuarioLogueadoEnEstado,
      cancelarTurnoEnEstado,
      confirmarAsistenciaTurnoEnEstado,
      evaluarTurnoEnEstado,
      fijarCentrosEnEstado,
      filtrarCentrosEnEstado,
      cambiarTemaUsuarioEnEstado,
      fijarTurnoActualEnEstado,
      cambiarTokenFirebaseEnEstado,
      // Es el único que no está en acciones, envía el setState directamente
      asignarEstadoIrEvaluacion
    }}
    >
      {children}
    </ContextoEstados.Provider>
  );
};
