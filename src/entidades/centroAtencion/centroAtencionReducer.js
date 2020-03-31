
const estadoInicial = {
	centros: [],
	centroSeleccionado: []
};
  
const centroAtencionReducer = (state = estadoInicial, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'SET_CENTROS':
			return {
				centros: payload.centros
			};
		case 'SET_CATEGORIAS':
			const centroSel = state.centros.find(centro => centro.id == payload.idCentro);
			centroSel.categorias = payload.categorias;
			return {
				...state,
				centroSeleccionado: centroSel
			};
		default:
			return state;
	}
};
  
export default centroAtencionReducer;
