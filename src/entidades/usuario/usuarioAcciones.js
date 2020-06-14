// @flow
import jwt from 'jwt-decode';
import { guardarDatosLocalmente } from '../../lib/ayudante';

export const agregarTurnoActivoAccion = (
  estadoLogin: Object,
  asignarEstadoLogin: Function,
  turnoActivo: Object
) => {
  const turnosActivos = [...estadoLogin.turnosActivos, turnoActivo];
  asignarEstadoLogin({ ...estadoLogin, ...{ turnosActivos } });
};

export const fijarTurnosActivosAccion = (
  estadoLogin: Object,
  asignarEstadoLogin: Function,
  turnosUsuario: Array<Object>
) => {
  const turnosActivos = turnosUsuario.filter(t => ['waiting', 'ready'].includes(t.status));
  const turnosParaEvaluar = turnosUsuario.filter(t => t.status === 'finished');
  asignarEstadoLogin({ ...estadoLogin, ...{ turnosActivos, turnosParaEvaluar } });
};

export const fijarUsuarioLogueadoAccion = (
  asignarEstadoLogin: Function,
  email: string,
  token: string,
  contrasena: string,
  fbtoken: string,
  temaUsuario: string
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
  guardarDatosLocalmente('@contraseña', contrasena);
  guardarDatosLocalmente('@fbtoken', fbtoken);

  asignarEstadoLogin({
    email,
    token,
    fbtoken,
    nombre,
    iniciales: (`${inicialNombre}${inicialApellido}`).toUpperCase(),
    temaUsuario
  });
};

export const cancelarTurnoAccion = (
  estadoLogin: Object,
  asignarEstadoLogin: Function,
  turno: Object
) => {
  const turnosActivos = estadoLogin.turnosActivos.filter(t => t.id !== turno.id);
  asignarEstadoLogin({ ...estadoLogin, ...{ turnosActivos } });
};

export const confirmarAsistenciaTurnoAccion = (
  estadoLogin: Object,
  asignarEstadoLogin: Function,
  turno: Object
) => {
  const { turnosActivos } = estadoLogin;
  const indice = turnosActivos.findIndex(t => t.id === turno.id);
  turnosActivos[indice].status = 'ready';
  asignarEstadoLogin({ ...estadoLogin, ...{ turnosActivos } });
};

export const evaluarTurnoAccion = (
  estadoLogin: Object,
  asignarEstadoLogin: Function,
  turno: Object
) => {
  const turnosParaEvaluar = estadoLogin.turnosParaEvaluar.filter(t => t.id !== turno.id);
  asignarEstadoLogin({ ...estadoLogin, ...{ turnosParaEvaluar } });
};

export const fijarTemaUsuarioAccion = (
  estadoLogin: Object,
  asignarEstadoLogin: Function,
  temaUsuario: string
) => {
  asignarEstadoLogin({ ...estadoLogin, ...{ temaUsuario } });
};

export const cambiarTemaUsuarioAccion = (estadoLogin: Object, asignarEstadoLogin: Function) => {
  const temaUsuario = !estadoLogin?.temaUsuario || estadoLogin?.temaUsuario === 'temaOscuro' ? 'temaClaro' : 'temaOscuro';
  guardarDatosLocalmente('@temaUsuario', temaUsuario);
  fijarTemaUsuarioAccion(estadoLogin, asignarEstadoLogin, temaUsuario);
};
