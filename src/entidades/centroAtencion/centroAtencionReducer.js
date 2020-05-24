// @flow
const estadoInicial = {
  centros: [],
  centroSeleccionado: []
};

const centroAtencionReducer = (state: Object = estadoInicial, action: Object) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_CENTROS':
      return {
        centros: payload.centros
      };
    default:
      return state;
  }
};

export default centroAtencionReducer;
