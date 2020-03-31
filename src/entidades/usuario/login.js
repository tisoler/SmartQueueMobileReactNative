import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import TextoIngreso from '../../componentes/comunes/textoIngreso';
import { login } from '../../lib/servicios';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoStates } from '../../lib/contextoStates';
import { imagenLogo } from '../../lib/constantes';

const Login = ({ navigation }) => {
	const [emailUsuario, cambioEmail] = useState('');
	const [passwordUsuario, cambioPassword] = useState('');
	const [cargando, cambioCargando] = useState(false);
	const [loginIncorrecto, cambioLogin] = useState(false);
	const { loginDispatch } = useContext(ContextoStates);

	const manejarLogin = () => {
		cambioLogin(false);
		cambioCargando(true);
		const payload = {email: emailUsuario, password: passwordUsuario};
		login(payload)
		.then(res => res.json())
		.then(response => {
			cambioCargando(false);
			if(response.success){
				loginDispatch({
					type: 'SET_LOGIN',
					payload: { email: payload.email, token: response.token }
				});
				navigation.navigate('ListaCentrosAtencion');
			} else {
				cambioLogin(true);
			}
		})
		.catch(error => alert('Error durante el login.'));
	};

	const registrarse = () => {
		navigation.navigate('Registro');
	}

	return (
		<View style={styles.container}>
			<Image source={imagenLogo} style={styles.logo}/>
			<TextoIngreso
				PlaceholderText='Email'
				ManejadorCambioTexto={cambioEmail}
				Value={emailUsuario}
				SoloLectura={cargando}
				ManejadorClick={() => cambioLogin(false)}
			/>
			<TextoIngreso
				PlaceholderText='Contraseña'
				ManejadorCambioTexto={cambioPassword}
				Value={passwordUsuario}
				SoloLectura={cargando}
				EsconderTexto={true}
				ManejadorClick={() => cambioLogin(false)}
			/>
			{ loginIncorrecto && <Text style={styles.mensajeError}>Usuario o contraseña incorrectos.</Text> }
			<BotonRedondeado
				ManejadorClick={manejarLogin}
				Cargando={cargando}
				Color='#fff'
			>
				INGRESAR
			</BotonRedondeado>
			{ !cargando &&
				<BotonRedondeado
					ManejadorClick={registrarse}
					Cargando={false}
					Color='#005f79'
				>
					REGISTRARSE
				</BotonRedondeado>
			}
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0084a8',
		flexDirection: 'column',
		alignItems: 'center'
	},
	mensajeError: {
		color: 'red',
		fontSize: 16,
		fontWeight: 'bold'
	},
	logo: {
		marginTop: 25,
		marginBottom: 30
	}
});

export default withErrorBoundary('Error durante la carga.', Login);