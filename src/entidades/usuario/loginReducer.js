/* eslint-disable no-case-declarations */
// @flow

const estadoInicial = {
  email: '',
  token: '',
  turnosActivos: []
};

const loginReducer = (state: Object = estadoInicial, action: Object) => {
  const { payload } = action;
  switch (action.type) {
    case 'SET_LOGIN':
      return {
        email: payload.email,
        token: payload.token
      };
    case 'SET_TURNOS_ACTIVOS':
      return {
        ...state,
        turnosActivos: payload.turnosActivos
      };
    case 'AGREGAR_TURNO_ACTIVOS':
      return {
        ...state,
        turnosActivos: [...state.turnosActivos, payload.turnoActivo]
      };
    default:
      return state;
  }
};

export default loginReducer;
