// @flow
import AsyncStorage from '@react-native-community/async-storage';

const guardarDatosLocalmente = async (clave: string, valor: string) => {
  try {
    await AsyncStorage.setItem(
      clave,
      valor
    );
  } catch (error) {
    // Error
  }
};

export const recuperarDatosLocalmente = async (clave: string) => {
  try {
    const value = await AsyncStorage.getItem(clave);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    // Error
  }
  return null;
};

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
  contrasena: string
) => {
  guardarDatosLocalmente('@email', email);
  guardarDatosLocalmente('@contraseña', contrasena);
  asignarEstadoLogin({ email, token });
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
