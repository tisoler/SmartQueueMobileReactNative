// @flow
import * as React from 'react';
import { createContext, useState } from 'react';
import {
  fijarTurnosAccion,
  fijarTodosTurnosAccion, // Borrar
  fijarUsuarioLogueadoAccion,
  removerTurnoAccion,
  evaluarTurnoAccion,
  cambiarTemaUsuarioAccion,
  cambiarIdiomaUsuarioAccion,
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
const idiomaUsuarioInicial = 'english';

export const ProveedorContextoEstados = (props: Props) => {
  const { children } = props;
  const [estadoLogin, asignarEstadoLogin] = useState(estadoInicialLogin);
  const [estadoCentros, asignarEstadoCentros] = useState();
  const [estadoTurnosActivos, asignarEstadoTurnosActivos] = useState();
  const [estadoTurnosAgendadosActivos, asignarEstadoTurnosAgendadosActivos] = useState();
  const [estadoTurnoActual, asignarEstadoTurnoActual] = useState();
  const [
    estadoTurnosParaEvaluar,
    asignarEstadoTurnosParaEvaluar
  ] = useState();
  const [estadoTemaUsuario, asignarEstadoTemaUsuario] = useState(temaUsuarioInicial);
  const [estadoIdiomaUsuario, asignarEstadoIdiomaUsuario] = useState(idiomaUsuarioInicial);
  const [estadoFbToken, asignarEstadoFbToken] = useState();
  const [estadoIrEvaluacion, asignarEstadoIrEvaluacion] = useState();

  // Interface contexto - acciones
  // Información usuario logueado
  const fijarTurnosEnEstado = (turnosUsuario: Array<Object>) => {
    fijarTurnosAccion(
      asignarEstadoTurnosActivos,
      asignarEstadoTurnosParaEvaluar,
      turnosUsuario
    );
  };
  const fijarTurnosAgendadosEnEstado = (turnosUsuario: Array<Object>) => {
    fijarTurnosAccion(
      asignarEstadoTurnosAgendadosActivos,
      asignarEstadoTurnosParaEvaluar,
      turnosUsuario
    );
  };

  // Revisar
  const fijarTodosTurnosEnEstado = (
    turnosFilasUsuario: Array<Object>,
    turnosAgendadosUsuario: Array<Object>
  ) => {
    fijarTodosTurnosAccion(
      asignarEstadoTurnosActivos,
      asignarEstadoTurnosAgendadosActivos,
      asignarEstadoTurnosParaEvaluar,
      turnosFilasUsuario,
      turnosAgendadosUsuario
    );
  };

  const fijarUsuarioLogueadoEnEstado = (
    email: string,
    token: string,
    fbtoken: string,
    temaUsuario? = 'temaOscuro',
    idiomaUsuario? = 'english',
  ) => {
    fijarUsuarioLogueadoAccion(
      email,
      token,
      fbtoken,
      temaUsuario,
      idiomaUsuario,
      asignarEstadoLogin,
      asignarEstadoTemaUsuario,
      asignarEstadoIdiomaUsuario,
      asignarEstadoFbToken,
    );
  };
  const removerTurnoEnEstado = (turno: Object) => {
    removerTurnoAccion(estadoTurnosActivos, asignarEstadoTurnosActivos, turno);
  };
  const removerTurnoAgendadoEnEstado = (turno: Object) => {
    removerTurnoAccion(estadoTurnosAgendadosActivos, asignarEstadoTurnosAgendadosActivos, turno);
  };
  const evaluarTurnoEnEstado = (turno: Object) => {
    evaluarTurnoAccion(estadoTurnosParaEvaluar, asignarEstadoTurnosParaEvaluar, turno);
  };
  const cambiarTemaUsuarioEnEstado = () => {
    cambiarTemaUsuarioAccion(estadoTemaUsuario, asignarEstadoTemaUsuario);
  };
  const cambiarIdiomaUsuarioEnEstado = () => {
    cambiarIdiomaUsuarioAccion(estadoIdiomaUsuario, asignarEstadoIdiomaUsuario);
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
  const fijarTurnoActualEnEstado = (turno: Object, demora: Object) => {
    fijarTurnoActualAccion(asignarEstadoTurnoActual, turno, demora);
  };
  // Fin interface contexto - acciones

  return (
    <ContextoEstados.Provider value={{
      estadoLogin,
      estadoCentros,
      estadoTurnosActivos,
      estadoTurnosAgendadosActivos,
      estadoTurnosParaEvaluar,
      estadoTemaUsuario,
      estadoIdiomaUsuario,
      estadoTurnoActual,
      estadoFbToken,
      estadoIrEvaluacion,
      fijarTurnosEnEstado,
      fijarTurnosAgendadosEnEstado,
      fijarTodosTurnosEnEstado,
      fijarUsuarioLogueadoEnEstado,
      removerTurnoEnEstado,
      removerTurnoAgendadoEnEstado,
      evaluarTurnoEnEstado,
      fijarCentrosEnEstado,
      filtrarCentrosEnEstado,
      cambiarTemaUsuarioEnEstado,
      cambiarIdiomaUsuarioEnEstado,
      fijarTurnoActualEnEstado,
      cambiarTokenFirebaseEnEstado,
      // Solamente expuesto para cuando hay idioma en almacenamiento local pero no email
      asignarEstadoIdiomaUsuario,
      // Es el único que no está en acciones, envía el setState directamente
      asignarEstadoIrEvaluacion
    }}
    >
      {children}
    </ContextoEstados.Provider>
  );
};
