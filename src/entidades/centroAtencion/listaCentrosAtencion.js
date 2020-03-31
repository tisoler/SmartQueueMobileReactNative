import React, {useContext, useEffect} from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import { ContextoStates } from '../../lib/contextoStates';
import { obtenerCentrosAtencion, obtenerCategoriasDeCentro } from '../../lib/servicios';
import ImagenLink from '../../componentes/comunes/imagenLink';

const ListaCentrosAtencion = ({ navigation }) => {
	const { loginState, centrosState, centrosDispatch } = useContext(ContextoStates);
	useEffect(() => {
		if(centrosState == null || centrosState.centros.length == 0) {
			obtenerCentrosAtencion(loginState.token)
			.then(res => res.json())
			.then(response => {
				centrosDispatch({
					type: 'SET_CENTROS',
					payload: { centros: response.response }
				});
			})
			.catch(error => alert('Error durante la carga de centros.'));
		}
	}, []);

	const seleccionarCentro = (centro) => {

		// Esta parte se va cuando tengamos las categorías en los centros precargados
		obtenerCategoriasDeCentro(loginState.token, centro.id)
		.then(res => res.json())
		.then(response => {
			centrosDispatch({
				type: 'SET_CATEGORIAS',
				payload: { idCentro: centro.id, categorias: response.response }
			});
		})
		.catch(error => alert('Error durante la carga de categorías.'));
		// -----------------------------------------------------------------------
		// -----------------------------------------------------------------------

		navigation.navigate('CentroAtencion', { centro });
	}

	if(centrosState != null) {
		<ActivityIndicator style={styles.actividad} size="large" color="#0084a8" />;
	}

	const centros = centrosState != null ? centrosState.centros : [];

	return (
		<View style={styles.container}>
			{ centros.map(centro => <ImagenLink key={centro.id} AppIcon={centro.app_icon} ManejadorClick={() => seleccionarCentro(centro)}/>) }
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: '#0084a8',
    flexDirection: 'row',
    flexWrap: 'wrap',
		justifyContent: 'center'
	}
});

export default withErrorBoundary('Error durante la carga del listadp de centros.', ListaCentrosAtencion);
