
export const agregarTurnoActivoState = (dispatch, turnoActivo) => {
  dispatch({
    type: 'AGREGAR_TURNO_ACTIVOS',
    payload: { turnoActivo }
  });
};

export const setearTurnosActivos = (dispatch, turnosActivos) => {
  dispatch({
    type: 'SET_TURNOS_ACTIVOS',
    payload: { turnosActivos }
  });
};

export const setearUsuarioLogueado = (dispatch, email, token) => {
  dispatch({
    type: 'SET_LOGIN',
    payload: { email, token }
  });
};

export const cancelarTurnoState = (dispatch, turno) => {
  dispatch({
    type: 'CANCELAR_TURNO',
    payload: { turno }
  });
};

export const evaluarTurnoState = (dispatch, turno) => {
  dispatch({
    type: 'EVALUAR_TURNO',
    payload: { turno }
  });
};
