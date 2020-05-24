// @flow

const setearCentros = (dispatch: Function, centros: Array<Object>) => {
  dispatch({
    type: 'SET_CENTROS',
    payload: { centros }
  });
};

export default setearCentros;
