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

export const agregarTurnoActivoState = (dispatch: Function, turnoActivo: Object) => {
  dispatch({
    type: 'AGREGAR_TURNO_ACTIVOS',
    payload: { turnoActivo }
  });
};

export const setearTurnosActivos = (dispatch: Function, turnosActivos: Array<Object>) => {
  dispatch({
    type: 'SET_TURNOS_ACTIVOS',
    payload: { turnosActivos }
  });
};

export const setearUsuarioLogueado = (
  dispatch: Function,
  email: string,
  token: string,
  contrasena: string
) => {
  guardarDatosLocalmente('@email', email);
  guardarDatosLocalmente('@contraseña', contrasena);
  dispatch({
    type: 'SET_LOGIN',
    payload: { email, token }
  });
};

export const cancelarTurnoState = (dispatch: Function, turno: Object) => {
  dispatch({
    type: 'CANCELAR_TURNO',
    payload: { turno }
  });
};

export const confirmarAsistenciaTurnoState = (dispatch: Function, turno: Object) => {
  dispatch({
    type: 'CONFIRMAR_ASISTENCIA_TURNO',
    payload: { turno }
  });
};

export const evaluarTurnoState = (dispatch: Function, turno: Object) => {
  dispatch({
    type: 'EVALUAR_TURNO',
    payload: { turno }
  });
};
