// @flow
import * as React from 'react';
import { useContext, useState } from 'react';
import {
  View, StyleSheet, Text, Image, ActivityIndicator, Alert
} from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import { ContextoStates } from '../../lib/contextoStates';
import { iconosCentros } from '../../lib/constantes';
import { estimarDemora, generarTicket } from '../../lib/servicios';
import BotonPopup from '../../componentes/comunes/botonPopup';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { agregarTurnoActivoState } from '../usuario/usuarioAcciones';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#026F8E',
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

const CentrosAtencion = ({ route, navigation }) => {
  const { centro } = route.params;
  const [turnoPedido, setTurnoPedido] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [categoriaSeleccionada, setCategoria] = useState({});
  const [demora, setDemora] = useState({});
  const { loginState, loginDispatch } = useContext(ContextoStates);

  const pedirTurno = (categoria) => {
    setTurnoPedido(true);
    setCargando(true);
    setCategoria({}); // resetea demora estimada y la vuelve a consultar
    estimarDemora(loginState.token, categoria.id, centro.id)
      .then(res => res.json())
      .then(respuesta => {
        setDemora(respuesta.response.wait);
        setCategoria(categoria);
        setCargando(false);
      })
      .catch(() => Alert.alert('Error en la solicitud de turno.'));
  };

  const confirmarTurno = () => {
    setCargando(true);
    generarTicket(loginState.token, categoriaSeleccionada.id, centro.id)
      .then(res => res.json())
      .then(respuesta => {
        setCargando(false);
        agregarTurnoActivoState(loginDispatch, respuesta.response.ticket);
        navigation.navigate('Turno', { turno: respuesta.response.ticket, demoraTurnoCreado: demora });
        setTurnoPedido(false);
      })
      .catch(() => Alert.alert('Error en la solicitud de turno.'));
  };

  const obtenerBotonesCategorias = () => (
    centro.Categories.map(categ => (
      <BotonRedondeado key={categ.id} manejadorClick={() => pedirTurno(categ)}>
        { categ.description }
      </BotonRedondeado>
    ))
  );

  const obtenerPopupConfirmacion = () => (
    <View style={estilos.contenedorConfirmacion}>
      <View style={estilos.contenedorMensaje}>
        <Text style={estilos.titulo}>
          { categoriaSeleccionada.description }
        </Text>
        <Text style={estilos.mensaje}>
          Hay
          {' '}
          {demora.tickets}
          {' '}
          trámites antes del suyo. Tiempo estimado:
          {demora.hours}
          {' '}
          horas
          {demora.minutes}
          {' '}
          minutos.
        </Text>
        <Text style={estilos.mensaje}>
          ¿Desea tomar el turno?
        </Text>
      </View>
      <View style={estilos.contenedorBotonesConfirmacion}>
        <BotonPopup
          height={80}
          width="50%"
          manejadorClick={() => setTurnoPedido(false)}
          colorFondo="#044F58"
        >
          NO
        </BotonPopup>
        <BotonPopup
          height={80}
          width="50%"
          manejadorClick={() => confirmarTurno()}
          colorFondo="#1CA3B3"
        >
          SÍ
        </BotonPopup>
      </View>
    </View>
  );

  const obtenerRender = () => {
    if (!turnoPedido) {
      return obtenerBotonesCategorias();
    }
    if (cargando) {
      return <ActivityIndicator size="large" color="#fff" />;
    }
    return obtenerPopupConfirmacion();
  };

  return (
    <View style={estilos.container}>
      <Image style={estilos.imagen} source={iconosCentros[centro.app_icon]} />
      { obtenerRender() }
    </View>
  );
};

export default withErrorBoundary('Error en centro de atención.', CentrosAtencion);
