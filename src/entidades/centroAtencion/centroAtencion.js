// @flow
import * as React from 'react';
import { useContext, useState } from 'react';
import {
  View, StyleSheet, Text, Image, ActivityIndicator, Alert
} from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import { ContextoEstados } from '../../lib/contextoEstados';
import { IconosCentros } from '../../lib/constantes';
import { estimarDemora, generarTicket } from '../../lib/servicios';
import BotonPopup from '../../componentes/comunes/botonPopup';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { recuperarMensajeError } from '../../lib/ayudante';

const CentrosAtencion = ({ route, navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { centro } = route.params;
  const [turnoPedido, setTurnoPedido] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [categoriaSeleccionada, setCategoria] = useState({});
  const [demora, setDemora] = useState({});
  const { estadoLogin, agregarTurnoActivoEnEstado } = useContext(ContextoEstados);
  const estilos = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: estilosGlobales.colorFondoContenedorDatos,
      flexDirection: 'column',
      alignItems: 'center'
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
      fontWeight: 'bold',
      color: estilosGlobales.colorTextoConfirmacionTurno
    },
    mensaje: {
      fontSize: 18,
      padding: 10,
      textAlign: 'justify',
      color: estilosGlobales.colorTextoConfirmacionTurno
    },
    contenedorBotonesConfirmacion: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      width: '100%'
    }
  });

  const pedirTurno = (categoria) => {
    setTurnoPedido(true);
    setCargando(true);
    setCategoria({}); // resetea demora estimada y la vuelve a consultar
    estimarDemora(estadoLogin.token, categoria.id, centro.id)
      .then(res => res.json())
      .then(respuesta => {
        setDemora(respuesta.response.wait);
        setCategoria(categoria);
        setCargando(false);
      })
      .catch((error) => Alert.alert(recuperarMensajeError(error.message, 'Error en la solicitud de turno.')));
  };

  const confirmarTurno = () => {
    setCargando(true);
    generarTicket(estadoLogin.token, categoriaSeleccionada.id, centro.id)
      .then(res => res.json())
      .then(respuesta => {
        setCargando(false);
        agregarTurnoActivoEnEstado(respuesta.response.ticket);
        navigation.navigate('Turno', { turno: respuesta.response.ticket, demoraTurnoCreado: demora });
        setTurnoPedido(false);
      })
      .catch((error) => Alert.alert(recuperarMensajeError(error.message, 'Error en la solicitud de turno.')));
  };

  const obtenerBotonesCategorias = () => (
    centro.Categories.map(categ => (
      <BotonRedondeado
        key={categ.id}
        manejadorClick={() => pedirTurno(categ)}
        estilo={{ marginTop: 22 }}
      >
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
          colorFondo={estilosGlobales.colorFondoGlobal}
        >
          NO
        </BotonPopup>
        <BotonPopup
          height={80}
          width="50%"
          manejadorClick={() => confirmarTurno()}
          colorFondo={estilosGlobales.colorFondoBotonPrincipal}
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
      <Image style={estilosGlobales.imagenLogoCentro} source={IconosCentros[centro.app_icon]} />
      { obtenerRender() }
    </View>
  );
};

export default withErrorBoundary('Error en centro de atención.', CentrosAtencion);
