/* eslint-disable no-case-declarations */
// @flow

const estadoInicial = {
  email: '',
  token: '',
  turnosActivos: [],
  turnosParaEvaluar: []
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
        turnosActivos: payload.turnosActivos.filter(t => ['waiting', 'ready'].includes(t.status)),
        turnosParaEvaluar: payload.turnosActivos.filter(t => t.status === 'finished')
      };
    case 'AGREGAR_TURNO_ACTIVOS':
      return {
        ...state,
        turnosActivos: [...state.turnosActivos, payload.turnoActivo]
      };
    case 'CANCELAR_TURNO':
      return {
        ...state,
        turnosActivos: state.turnosActivos.filter(t => t.id !== payload.turno.id)
      };
    case 'EVALUAR_TURNO':
      return {
        ...state,
        turnosParaEvaluar: state.turnosParaEvaluar.filter(t => t.id !== payload.turno.id)
      };
    default:
      return state;
  }
};

export default loginReducer;
