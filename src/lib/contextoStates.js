import React, { createContext, useReducer } from 'react';
import loginReducer from '../entidades/usuario/loginReducer';
import centroAtencionReducer from '../entidades/centroAtencion/centroAtencionReducer';

export const ContextoStates = createContext();

export const ContextoStatesProvider = props => {    
	const [loginState, loginDispatch] = useReducer(loginReducer);
	const [centrosState, centrosDispatch] = useReducer(centroAtencionReducer);
	return (
			<ContextoStates.Provider value={{ loginState, loginDispatch, centrosState, centrosDispatch }}>
					{props.children}
			</ContextoStates.Provider>
	);
};