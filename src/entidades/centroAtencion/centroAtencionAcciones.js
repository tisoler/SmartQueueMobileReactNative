
const setearCentros = (dispatch, centros) => {
  dispatch({
    type: 'SET_CENTROS',
    payload: { centros }
  });
};

export default setearCentros;
