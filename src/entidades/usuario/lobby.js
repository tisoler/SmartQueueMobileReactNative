// @flow
import React, { useEffect, useContext } from 'react';
import {
  View, StyleSheet, Alert, ActivityIndicator, Text, ScrollView
} from 'react-native';
import { obtenerTicketsParaUsuario, obtenerCentrosAtencion } from '../../lib/servicios';
import { ContextoEstados } from '../../lib/contextoEstados';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import Teja from '../../componentes/comunes/teja';
import TejaChica from '../../componentes/comunes/tejaChica';
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
    estadoCentros,
    estadoTurnosActivos,
    estadoFbToken,
    estadoTemaUsuario,
    fijarTurnosEnEstado,
    fijarCentrosEnEstado,
    cambiarTokenFirebaseEnEstado,
    fijarUsuarioLogueadoEnEstado,
    fijarTurnoActualEnEstado,
    asignarEstadoIrEvaluacion
  } = useContext(ContextoEstados);
  const { abrirDialogoEmergente } = useContext(ContextoDialogoEmergente);

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: estilosGlobales.colorFondoGlobal,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    encabezado: {
      height: 23,
      width: '100%',
      backgroundColor: estilosGlobales.colorBarraNavegacion,
    },
    texto: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: 13.5,
      textAlign: 'center',
      width: estilosGlobales.tamañoLogoCentroTeja + 40,
    },
    contenedorTituloCentros: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      backgroundColor: '#ffffff',
      width: '80%',
      height: 45,
      borderRadius: 10,
      color: estilosGlobales.colorTextoGeneral,
    },
    contenedorCentros: {
      backgroundColor: estilosGlobales.colorFondoContenedorDatos,
      width: '100%',
      paddingBottom: 10,
      height: 225,
      paddingTop: 55,
    },
    contenedorTurnos: {
      alignItems: 'center',
      backgroundColor: estilosGlobales.colorFondoGlobal,
      width: '100%',
      flex: 3,
      paddingTop: 40,
    },
    centro: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: 16,
      textAlign: 'center',
      paddingLeft: 4,
      paddingRight: 4,
    },
    categoria: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: 15,
      textAlign: 'center',
    },
    espera: {
      fontSize: 17,
      color: '#FFAE0C',
      textAlign: 'right',
      paddingRight: 5,
    },
    enLugar: {
      fontSize: 17,
      color: '#14DE00',
      textAlign: 'right',
      paddingRight: 5,
    },
    contenedorHijos: {
      flex: 2,
      flexDirection: 'column',
    },
    subContenedorTitulo: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 225,
      width: '90%',
      backgroundColor: '#8B6CC6',
      height: 45,
      borderRadius: 10,
      zIndex: 1
    },
  });

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
          Alert.alert('Error al cargar sus turnos.');
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

    if (estadoCentros == null || estadoCentros.centros.length === 0) {
      obtenerCentrosAtencion(estadoLogin.token)
        .then(res => res.json())
        .then(respuesta => {
          fijarCentrosEnEstado(respuesta.response);
        })
        .catch((error) => {
          if (esTokenValido(
            error?.message,
            fijarUsuarioLogueadoEnEstado,
            estadoLogin.email,
            estadoFbToken,
            estadoTemaUsuario
          )) {
            Alert.alert(procesarMensajeError(error.message, 'Error durante la carga de centros.'));
          }
        });
    }

    // Configura un intervalo de consulta para refrescar los turnos cada 1 minuto.
    const idIntervalo = setInterval(() => {
      consultarTicketsDeUsuario();
    }, 60000);
    // Cuando el usuario abandona la pantalla limpia el intervalo.
    return () => {
      clearInterval(idIntervalo);
    };
  }, []);

  const seleccionarTurnoActivo = (turno) => {
    fijarTurnoActualEnEstado(turno, null);
    navigation.navigate('Turno');
  };

  const obtenerTurnoParaCentro = (idCentro) => estadoTurnosActivos
    .find(turno => turno.Center.id === idCentro);

  const seleccionarCentro = (centro) => {
    const turnoExistente = obtenerTurnoParaCentro(centro.id);
    // const turnoAgendadoExistente = obtenerTurnoAgendadoParaCentro(centro.id);
    const turnoAgendadoExistente = null;
    // if centro.service_type: 0 = fila, 1 = agendado, 2 = ambos
    const tipoServicio = 2;
    switch (tipoServicio) {
      case 0:
        if (turnoExistente) {
          fijarTurnoActualEnEstado(turnoExistente, null);
          navigation.navigate('Turno');
        } else {
          navigation.navigate('CentroAtencion', { centro });
        }
        break;
      case 1:
        navigation.navigate('CentroAtencion', { centro });
        break;
      default:
        navigation.navigate('TipoTurno', { centro, turnoExistente, turnoAgendadoExistente });
        break;
    }
  };

  if (!estadoTurnosActivos || !estadoCentros) {
    return (
      <View style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  const ListadoCentros = () => (
    <View style={estilos.contenedorCentros}>
      <ScrollView horizontal showsVerticalScrollIndicator={false}>
        { estadoCentros.centros.map(centro => (
          <TejaChica
            key={centro.id}
            appIcon={centro.app_icon}
            manejadorClick={() => seleccionarCentro(centro)}
          >
            <Text multiline editable={false} style={estilos.texto}>{centro.name}</Text>
          </TejaChica>
        ))}
      </ScrollView>
    </View>
  );

  const TurnosPedidos = () => (
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
  );

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.encabezado} />
      <View style={estilos.contenedorTituloCentros} elevation={5}>
        <Text style={estilosGlobales.tituloSeccion}>Sacar turno para:</Text>
      </View>
      <ListadoCentros />
      <View style={estilos.subContenedorTitulo} elevation={5}>
        <Text style={estilosGlobales.tituloSeccionClaro}>
          { estadoTurnosActivos.length > 0 ? 'Turnos pedidos:' : 'Usted no tiene turnos pedidos' }
        </Text>
      </View>
      { estadoTurnosActivos.length > 0 && <TurnosPedidos />}
    </View>
  );
};

export default withErrorBoundary('Error iniciando sesión.', withDialogoEmergente(Lobby));
