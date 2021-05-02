/* eslint-disable camelcase */
// @flow
import * as React from 'react';
import { useContext, useState } from 'react';
import {
  View, StyleSheet, Text, Image, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import { ContextoEstados } from '../../lib/contextoEstados';
import { IconosCentros } from '../../lib/constantes';
import { estimarDemora, generarTicket } from '../../lib/servicios';
import BotonPopup from '../../componentes/comunes/botonPopup';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { procesarMensajeError, esTokenValido } from '../../lib/ayudante';

const CentrosAtencion = ({ route, navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { centro } = route?.params;
  const [turnoPedido, setTurnoPedido] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [categoriaSeleccionada, setCategoria] = useState({});
  const [demora, setDemora] = useState({});
  const {
    estadoLogin,
    estadoTurnosActivos,
    estadoFbToken,
    estadoTemaUsuario,
    agregarTurnoActivoEnEstado,
    fijarUsuarioLogueadoEnEstado,
    fijarTurnoActualEnEstado
  } = useContext(ContextoEstados);

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: estilosGlobales.colorFondoContenedorDatos,
      flexDirection: 'column',
      alignItems: 'center'
    },
    subContenedor: {
      backgroundColor: estilosGlobales.colorFondoGlobal,
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    explicacion: {
      paddingBottom: 25,
    },
    contenedorConfirmacion: {
      width: '90%',
      backgroundColor: '#fff',
      alignItems: 'center',
      marginTop: 7
    },
    contenedorMensaje: {
      alignItems: 'center',
      backgroundColor: '#fff',
      width: '100%',
      paddingBottom: 15
    },
    titulo: {
      textAlign: 'center',
      fontSize: 19,
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#8B6CC6',
      borderRadius: 40,
      height: 45,
      lineHeight: 45,
      width: 105,
      marginTop: 10,
      marginBottom: 10,
    },
    mensaje: {
      fontSize: 18,
      padding: 3,
      textAlign: 'center',
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
    estimarDemora(estadoLogin.token, categoria.id, centro.id)
      .then(res => res.json())
      .then(respuesta => {
        setDemora(respuesta.response.wait);
        setCategoria(categoria);
        setCargando(false);
      })
      .catch((error) => {
        if (esTokenValido(
          error?.message,
          fijarUsuarioLogueadoEnEstado,
          estadoLogin.email,
          estadoFbToken,
          estadoTemaUsuario
        )) {
          Alert.alert(procesarMensajeError(error.message, 'Error en la solicitud de turno.'));
        }
      });
  };

  const confirmarTurno = () => {
    setCargando(true);
    generarTicket(estadoLogin.token, categoriaSeleccionada.id, centro.id)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta?.success) {
          agregarTurnoActivoEnEstado(respuesta?.response?.ticket);
          fijarTurnoActualEnEstado(respuesta?.response?.ticket, demora);
          navigation.navigate('Turno');
        } else {
          Alert.alert('Error en la solicitud de turno.');
        }
      })
      .catch((error) => {
        if (esTokenValido(
          error?.message,
          fijarUsuarioLogueadoEnEstado,
          estadoLogin.email,
          estadoFbToken,
          estadoTemaUsuario
        )) {
          Alert.alert(procesarMensajeError(error.message, 'Error en la solicitud de turno.'));
        }
      });
  };

  const obtenerBotonesCategorias = () => (
    centro.Categories.map((categ, idx) => (
      <BotonRedondeado
        key={categ.id}
        manejadorClick={() => pedirTurno(categ)}
        estilo={{ marginTop: 22 }}
        colorFondo={idx % 2 === 0
          ? estilosGlobales.colorFondoBotonPrincipal
          : '#8B6CC6'}
        colorBorde={idx % 2 === 0
          ? estilosGlobales.colorBordeBotonPrincipal
          : '#8B6CC6'}
        flechaAlFinal
      >
        { categ.description }
      </BotonRedondeado>
    ))
  );

  const turnosAnteriores = demora?.tickets != null ? demora?.tickets : -1;
  // eslint-disable-next-line no-nested-ternary
  const mensajeTurnosAnteriores = turnosAnteriores === 1
    ? 'Hay 1 turno antes del suyo.'
    : turnosAnteriores > 1
      ? `Hay ${turnosAnteriores} turnos antes del suyo.`
      : 'No hay ningún turno antes del suyo.';

  const obtenerPopupConfirmacion = () => (
    <View style={estilos.contenedorConfirmacion}>
      <View style={estilos.contenedorMensaje}>
        <Text style={estilos.titulo}>{ categoriaSeleccionada.description }</Text>
        <Text style={estilos.mensaje}>{mensajeTurnosAnteriores}</Text>
        <Text style={estilos.mensaje}>
          {`La demora estimada es de ${demora?.hours > 0 ? `${demora?.hours} hs.` : ''} ${demora?.minutes ? parseInt(demora.minutes, 10) : '?'} minutos.`}
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
          No
        </BotonPopup>
        <BotonPopup
          height={80}
          width="50%"
          manejadorClick={() => confirmarTurno()}
          colorFondo={estilosGlobales.colorFondoBotonPrincipal}
        >
          Sí
        </BotonPopup>
      </View>
    </View>
  );

  // Cuando el usuario confirma el turno (pantalla turno) y vuelve con el "volver" del SO
  // no tiene que cargar esta pantalla, debe ir a la lobby.
  if (estadoTurnosActivos.some(t => t.Center.id === centro.id)) {
    navigation.navigate('Lobby');
  }

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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={estilos.contenedor}>
        <View style={estilos.subContenedor}>
          <Image style={estilosGlobales.imagenLogoCentro} source={IconosCentros[centro.app_icon]} />
          <Text style={{ ...estilosGlobales.subtituloGrande, ...{ paddingBottom: 25 } }}>
            {centro?.name}
          </Text>
          {!turnoPedido && (
            <Text style={[estilosGlobales.textoAviso, estilos.explicacion]}>
              Seleccione una categoría por favor.
            </Text>
          )}
        </View>
        { obtenerRender() }
      </View>
    </ScrollView>
  );
};

export default withErrorBoundary('Error en centro de atención.', withDialogoEmergente(CentrosAtencion));
