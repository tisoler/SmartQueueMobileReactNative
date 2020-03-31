import React from 'react';
import { StyleSheet, TouchableHighlight, Image } from 'react-native';
import { iconosCentros } from '../../lib/constantes';
import BotonRipple from './botonRipple'

const ImagenLink = (props) => {
	return (
		<BotonRipple
			ManejadorClick={props.ManejadorClick}
			height={150}
			width={150}
			colorBoton='#0084a8'
		>
			<Image
				style={styles.imagen}
				source={iconosCentros[props.AppIcon]}
			/>
		</BotonRipple>
	);
}

const styles = StyleSheet.create({
	imagen: {
		height: 150,
		width: 150
	}
});

export default ImagenLink;
