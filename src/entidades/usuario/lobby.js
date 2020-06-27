// @flow
import React, { useEffect, useContext } from 'react';
import {
  View, StyleSheet, Alert, ActivityIndicator, Text, ScrollView, Dimensions
} from 'react-native';
import { obtenerTicketsParaUsuario } from '../../lib/servicios';
import { ContextoEstados } from '../../lib/contextoEstados';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import Teja from '../../componentes/comunes/teja';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { ContextoDialogoEmergente } from '../../lib/contextoDialogoEmergente';
import {
  procesarMensajeError,
  esTokenValido,
  crearClienteFirebase
} from '../../lib/ayudante';

const Lobby = ({ navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const {
    estadoLogin,
    estadoTurnosActivos,
    estadoFbToken,
    estadoTemaUsuario,
    fijarTurnosEnEstado,
    cambiarTokenFirebaseEnEstado,
    fijarUsuarioLogueadoEnEstado,
    fijarTurnoActualEnEstado,
    asignarEstadoIrEvaluacion
  } = useContext(ContextoEstados);
  const { abrirDialogoEmergente } = useContext(ContextoDialogoEmergente);
  useEffect(() => {
    // Levanta el cliente Firebase y los listeners
    crearClienteFirebase(
      estadoLogin,
      cambiarTokenFirebaseEnEstado,
      navigation,
      fijarTurnoActualEnEstado,
      fijarTurnosEnEstado,
      asignarEstadoIrEvaluacion,
      abrirDialogoEmergente
    );
    // --- Fin Firebase ----

    const consultarTicketsDeUsuario = () => obtenerTicketsParaUsuario(estadoLogin.token)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta.success) {
          fijarTurnosEnEstado(respuesta.response);
        } else {
          Alert.alert('Error durante la carga de turnos activos.');
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
          Alert.alert(procesarMensajeError(error.message, 'Error durante la carga de turnos activos.'));
        }
      });

    consultarTicketsDeUsuario();

    // Configura un intervalo de consulta para refrescar los turnos cada 1 minuto.
    const idIntervalo = setInterval(() => {
      consultarTicketsDeUsuario();
    }, 60000);
    // Cuando el usuario abandona la pantalla limpia el intervalo.
    return () => {
      clearInterval(idIntervalo);
    };
  }, []);

  const pedirTurno = () => {
    navigation.navigate('ListaCentrosAtencion');
  };

  const seleccionarTurnoActivo = (turno) => {
    fijarTurnoActualEnEstado(turno, null);
    navigation.navigate('Turno', { turno });
  };

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: estilosGlobales.colorFondoGlobal,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    contenedorTurnos: {
      backgroundColor: estilosGlobales.colorFondoContenedorDatos,
      width: '100%',
      flex: 3
    },
    centro: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: 19,
      paddingLeft: 10
    },
    categoria: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: 17,
      paddingLeft: 10
    },
    espera: {
      fontSize: 19,
      paddingLeft: 10,
      color: '#FFAE0C',
      textAlign: 'right'
    },
    enLugar: {
      fontSize: 20,
      paddingLeft: 10,
      color: '#14DE00',
      textAlign: 'right'
    },
    contenedorHijos: {
      flexDirection: 'column',
      width: Math.round(Dimensions.get('window').width) - 110
    },
    subContenedorTitulo: {
      alignItems: 'center',
      width: '100%',
      backgroundColor: estilosGlobales.colorFondoEncabezadoTitulos
    },
    subContenedorBotones: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    },
  });

  if (!estadoTurnosActivos) {
    return (
      <View style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.subContenedorTitulo}>
        <Text style={estilosGlobales.tituloSeccion}>
          { estadoTurnosActivos.length > 0 ? 'Turnos pedidos:' : 'Usted no tiene turnos pedidos' }
        </Text>
      </View>
      { estadoTurnosActivos.length > 0 && (
        <View style={estilos.contenedorTurnos}>
          <ScrollView showsVerticalScrollIndicator={false}>
            { estadoTurnosActivos.map(turno => (
              <Teja
                key={turno.id}
                appIcon={turno.Center.app_icon}
                manejadorClick={() => seleccionarTurnoActivo(turno)}
              >
                <View style={estilos.contenedorHijos}>
                  <Text style={estilos.centro}>{turno.Center.name}</Text>
                  <Text style={estilos.categoria}>{turno.Category.name}</Text>
                  <Text style={turno.status === 'waiting' ? estilos.espera : estilos.enLugar}>
                    {turno.status === 'waiting' ? 'Esperando' : 'En el lugar'}
                  </Text>
                </View>
              </Teja>
            ))}
          </ScrollView>
        </View>
      )}
      <View style={estilos.subContenedorBotones}>
        <BotonRedondeado manejadorClick={() => pedirTurno()}>
          NUEVO TURNO
        </BotonRedondeado>
      </View>
    </View>
  );
};

export default withErrorBoundary('Error iniciando sesión.', withDialogoEmergente(Lobby));
