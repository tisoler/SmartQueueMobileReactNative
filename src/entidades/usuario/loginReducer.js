
const estadoInicial = {
    email: '',
    // password: '',
    token: ''
};
  
const loginReducer = (state = estadoInicial, action) => {
	const { payload } = action;
	switch (action.type) {
		case 'SET_LOGIN':
			return {
				email: payload.email,
				// password: payload.password,
				token: payload.token
			};
		default:
			return state;
	}
};
  
export default loginReducer;
