import React from 'react';
import {
	StyleSheet,
	Text,
	ActivityIndicator
} from 'react-native';
import BotonRipple from './botonRipple'

const BotonRedondeado = (props) => {
	const boton = {
		marginTop: 20
	};
	
	return (
		<BotonRipple
			height={55}
			width='75%'
			style={boton}
			ManejadorClick={props.ManejadorClick}
			borderRadius={30}
			colorEfecto='#000'
			colorBoton={props.Color}
			estilo={boton}
		>
			{props.Cargando ?
				<ActivityIndicator style={estilos.actividad} size='large' color='#0084a8' />
			:
				<Text style ={estilos.texto}>{props.children}</Text>
			}
		</BotonRipple>
	)
}

const estilos = StyleSheet.create({
  actividad: {
		height: 55,
		zIndex: 2
	},
	texto: {
		lineHeight: 55,
		width: '100%',
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold'
	}
});

export default BotonRedondeado;
