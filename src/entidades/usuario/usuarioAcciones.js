// @flow
import jwt from 'jwt-decode';
import { guardarDatosLocalmente } from '../../lib/ayudante';

export const agregarTurnoActivoAccion = (
  estadoTurnosActivos: Object,
  asignarEstadoTurnosActivos: Function,
  turnoActivo: Object
) => {
  const turnosActivos = [...estadoTurnosActivos, turnoActivo];
  asignarEstadoTurnosActivos(turnosActivos);
};

export const fijarTurnosAccion = (
  asignarEstadoTurnosActivos: Function,
  asignarEstadoTurnosParaEvaluar: Function,
  turnosUsuario: Array<Object>
) => {
  const turnosActivos = turnosUsuario.filter(t => ['waiting', 'ready'].includes(t.status));
  const turnosParaEvaluar = turnosUsuario.filter(t => t.status === 'finished');
  asignarEstadoTurnosActivos(turnosActivos);
  asignarEstadoTurnosParaEvaluar(turnosParaEvaluar);
};

export const fijarUsuarioLogueadoAccion = (
  email: string,
  token: string,
  fbtoken: string,
  temaUsuario: string,
  asignarEstadoLogin: Function,
  asignarEstadoTemaUsuario: Function
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
  guardarDatosLocalmente('@fbtoken', fbtoken);

  asignarEstadoLogin({
    email,
    token,
    fbtoken,
    nombre,
    iniciales: (`${inicialNombre}${inicialApellido}`).toUpperCase()
  });
  asignarEstadoTemaUsuario(temaUsuario);
};

export const cancelarTurnoAccion = (
  estadoTurnosActivos: Object,
  asignarEstadoTurnosActivos: Function,
  turno: Object
) => {
  const turnosActivos = estadoTurnosActivos.filter(t => t.id !== turno.id);
  asignarEstadoTurnosActivos(turnosActivos);
};

export const confirmarAsistenciaTurnoAccion = (
  estadoTurnosActivos: Object,
  asignarEstadoTurnosActivos: Function,
  turno: Object
) => {
  const turnosActivos = [...estadoTurnosActivos];
  const indice = turnosActivos.findIndex(t => t.id === turno.id);
  turnosActivos[indice].status = 'ready';
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
