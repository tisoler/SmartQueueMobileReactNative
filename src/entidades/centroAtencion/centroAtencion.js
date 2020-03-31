import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import { ContextoStates } from '../../lib/contextoStates';
import { iconosCentros } from '../../lib/constantes';
import { estimarDemora, generarTicket } from '../../lib/servicios';
import BotonPopup from '../../componentes/comunes/botonPopup';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';

const CentrosAtencion = ({ route, navigation }) => {
  const { centro } = route.params;
	const [turnoPedido, setTurnoPedido] = useState(false);
	const [cargando, setCargando] = useState(false);
	const [categoriaSeleccionada, setCategoria] = useState(false);
	const [demora, setDemora] = useState([]);
	const { loginState } = useContext(ContextoStates);

	// Esta parte se va cuando tengamos las categorías en los centros precargados
	const { centrosState } = useContext(ContextoStates);
	let centroS = { categorias: [] };
	if(centrosState.centroSeleccionado != null) {
		centroS = centrosState.centroSeleccionado;
	}
	// -----------------------------------------------------------------------
	// -----------------------------------------------------------------------
	
	const pedirTurno = (categoria) => {
		setTurnoPedido(true);
		setCargando(true);
		setCategoria([]); //resetea demora estimada y la vuelve a consultar
		estimarDemora(loginState.token, categoria.id, centro.id)
		.then(res => res.json())
		.then(respuesta => {
			setDemora(respuesta.response.wait);
			setCategoria(categoria);
			setCargando(false);
		})
		.catch(error => alert('Error en la solicitud de turno.'));
	};

	const confirmarTurno = () => {
		setCargando(true);
		generarTicket(loginState.token, categoriaSeleccionada.id, centro.id)
		.then(res => res.json())
		.then(respuesta => {
			setCargando(false);
			navigation.navigate('Turno', { turno: respuesta.response.ticket, demoraTurnoCreado: demora });
		})
		.catch(error => alert('Error en la solicitud de turno.'));
	};

	return (
		<View style={estilos.container}>
			<Image style={estilos.imagen} source={iconosCentros[centro.app_icon]}/>

			{ !turnoPedido ?
				centroS.categorias.map(categ => 
					<BotonRedondeado key={categ.id} ManejadorClick={() => pedirTurno(categ)} Cargando={false} Color='#fff'>
						{ categ.description }
					</BotonRedondeado>
				)
			: ( cargando
					? <ActivityIndicator style={estilos.actividad} size='large' color='#fff' />
					:	<View style={estilos.contenedorConfirmacion}>
							<View style={estilos.contenedorMensaje}>
								<Text style={estilos.titulo}> 
									{ categoriaSeleccionada.description }
								</Text>
								<Text style={estilos.mensaje}>
									Hay {demora.tickets} trámites antes del suyo. Tiempo estimado: {demora.hours} horas {demora.minutes} minutos.
								</Text>
								<Text style={estilos.mensaje}>
									¿Desea tomar el turno?
								</Text>
							</View>
							<View style={estilos.contenedorBotonesConfirmacion}>
							<BotonPopup height={80} width={'50%'} ManejadorClick={() => setTurnoPedido(false)} Color='red'>
									NO
								</BotonPopup>
								
								<BotonPopup height={80} width={'50%'} ManejadorClick={() => confirmarTurno()} Color='green'>
									SÍ
								</BotonPopup>
							</View>
						</View>
				)
			}
		</View>
	);
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: '#0084a8',
    flexDirection: 'column',
		alignItems: 'center'
	},
	imagen: {
				height: 150,
				width: 150
	},
	contenedorConfirmacion: {
		width: '90%',
		backgroundColor: '#fff',
    alignItems: 'center'
	},
	contenedorMensaje: {
		alignItems: 'center',
		backgroundColor: '#fff',
		width: '100%',
		paddingBottom: 15
	},
	titulo: {
		fontSize: 22,
		paddingBottom: 10,
		paddingTop: 15,
		fontWeight: 'bold'
	},
	mensaje: {
		fontSize: 18,
		padding: 10,
		textAlign: 'justify'
	},
	contenedorBotonesConfirmacion: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		width: '100%'
	}
});

export default withErrorBoundary('Error en centro de atención.', CentrosAtencion);
