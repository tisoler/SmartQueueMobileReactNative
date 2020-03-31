
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import BotonRipple from './botonRipple'

const BotonPopup = (props) => {
	return (
		<BotonRipple 
			height={props.height} 
			width={props.width} 
			colorBoton={props.Color} 
			ManejadorClick={props.ManejadorClick} 
		>
			<Text style={estilos.textoBoton}>{props.children}</Text>
		</BotonRipple>
	)
}

const estilos = StyleSheet.create({
	textoBoton: {
		textAlign: 'center',
		lineHeight: 80,
		fontSize: 16,
		color: '#fff',
		fontWeight: 'bold',
		height: 80,
		width: '100%'
	}
});

export default BotonPopup;
