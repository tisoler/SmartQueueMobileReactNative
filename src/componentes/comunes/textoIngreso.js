import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

const TextoIngreso = (props) => {
	const manejadorClick = props.ManejadorClick ?? null;
	return (
			<TextInput
					style={styles.ingresos}
					placeholder={props.PlaceholderText}
					underlineColorAndroid="transparent"
					onChangeText={text => props.ManejadorCambioTexto(text)}
					value={props.Value}
					editable={!props.SoloLectura}
					secureTextEntry={props.EsconderTexto ?? false}
					onTouchStart={manejadorClick}
			/>
	);
}

const styles = StyleSheet.create({
	ingresos: {
			width: "75%",
			backgroundColor: '#fff',
			borderColor: 'white',
			borderWidth: 0,
			borderRadius: 30,
			fontSize: 20,
			height: 50,
			paddingLeft: 5,
			marginBottom: 20
	}
});

export default TextoIngreso;
