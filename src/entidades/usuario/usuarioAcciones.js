// @flow
import jwt from 'jwt-decode';
import { guardarDatosLocalmente } from '../../lib/ayudante';

export const fijarTurnosAccion = (
  asignarEstadoTurnosActivos: Function,
  asignarEstadoTurnosParaEvaluar: Function,
  turnosUsuario: Array<Object>
) => {
  const turnosActivos = turnosUsuario.filter(t => ['waiting', 'ready'].includes(t.status));
  const turnosParaEvaluar = turnosUsuario.filter(t => t.status === 'finished');
  asignarEstadoTurnosActivos(turnosActivos);
  if (turnosParaEvaluar?.length > 0) {
    asignarEstadoTurnosParaEvaluar(turnosParaEvaluar);
  }
};

// REVISAR Y BORRAR
export const fijarTodosTurnosAccion = (
  asignarEstadoTurnosActivos: Function,
  asignarEstadoTurnosAgendadosActivos: Function,
  asignarEstadoTurnosParaEvaluar: Function,
  turnosFilaUsuario: Array<Object>,
  turnosAgendadosUsuario: Array<Object>,
) => {
  const turnosFilaActivos = turnosFilaUsuario.filter(t => ['waiting', 'ready'].includes(t.status));
  const turnosAgendadosActivos = turnosAgendadosUsuario.filter(t => ['waiting', 'ready'].includes(t.status));
  const turnosFilaParaEvaluar = turnosFilaUsuario.filter(t => t.status === 'finished');
  const turnosAgendadosParaEvaluar = turnosAgendadosUsuario.filter(t => t.status === 'finished');
  const turnosParaEvaluar = [...turnosFilaParaEvaluar, ...turnosAgendadosParaEvaluar];
  asignarEstadoTurnosActivos(turnosFilaActivos);
  asignarEstadoTurnosAgendadosActivos(turnosAgendadosActivos);
  if (turnosParaEvaluar?.length > 0) asignarEstadoTurnosParaEvaluar(turnosParaEvaluar);
};

export const fijarUsuarioLogueadoAccion = (
  email: string,
  token: string,
  tokenFb: string,
  temaUsuario: string,
  idiomaUsuario: string,
  asignarEstadoLogin: Function,
  asignarEstadoTemaUsuario: Function,
  asignarEstadoIdiomaUsuario: Function,
  asignarEstadoFbToken: Function,
) => {
  let inicialNombre = '';
  let inicialApellido = '';
  let nombre = '';
  // Cuando cierra sesión no necesita decodificar el token, cargar nombre e iniciales.
  if (token) {
    const tokenDescodificado = jwt(token);
    inicialNombre = tokenDescodificado?.name ? tokenDescodificado.name.charAt(0) : '?';
    inicialApellido = tokenDescodificado?.surname ? tokenDescodificado.surname.charAt(0) : '?';
    nombre = `${tokenDescodificado?.name || ''} ${tokenDescodificado?.surname || ''}`;
  }

  guardarDatosLocalmente('@email', email);
  guardarDatosLocalmente('@token', token);
  guardarDatosLocalmente('@tokenFb', tokenFb);

  asignarEstadoLogin({
    email,
    token,
    nombre,
    iniciales: (`${inicialNombre}${inicialApellido}`).toUpperCase()
  });
  asignarEstadoTemaUsuario(temaUsuario);
  asignarEstadoIdiomaUsuario(idiomaUsuario);
  asignarEstadoFbToken(tokenFb);
};

export const removerTurnoAccion = (
  estadoTurnosActivos: Object,
  asignarEstadoTurnosActivos: Function,
  turno: Object
) => {
  const turnosActivos = estadoTurnosActivos.filter(t => t.id !== turno.id);
  asignarEstadoTurnosActivos(turnosActivos);
};

export const evaluarTurnoAccion = (
  estadoTurnosParaEvaluar: Object,
  asignarEstadoTurnosParaEvaluar: Function,
  turno: Object
) => {
  const turnosParaEvaluar = estadoTurnosParaEvaluar.filter(t => t.id !== turno.id);
  asignarEstadoTurnosParaEvaluar(turnosParaEvaluar);
};

export const cambiarTemaUsuarioAccion = (
  estadoTemaUsuario: Object,
  asignarEstadoTemaUsuario: Function
) => {
  const temaUsuario = estadoTemaUsuario === 'temaOscuro' ? 'temaClaro' : 'temaOscuro';
  guardarDatosLocalmente('@temaUsuario', temaUsuario);
  asignarEstadoTemaUsuario(temaUsuario);
};

export const cambiarIdiomaUsuarioAccion = (
  estadoIdiomaUsuario: Object,
  asignarEstadoIdiomaUsuario: Function
) => {
  const idiomaUsuario = estadoIdiomaUsuario === 'espaniol' ? 'english' : 'espaniol';
  guardarDatosLocalmente('@idiomaUsuario', idiomaUsuario);
  asignarEstadoIdiomaUsuario(idiomaUsuario);
};

export const cambiarTokenFirebaseAccion = (asignarEstadoFbToken: Function, tokenFb: string) => {
  guardarDatosLocalmente('@tokenFb', tokenFb);
  asignarEstadoFbToken(tokenFb);
};
