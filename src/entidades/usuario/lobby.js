// @flow
import React, { useEffect, useContext, useState } from 'react';
import {
  View, StyleSheet, Alert, ActivityIndicator, Text, ScrollView
} from 'react-native';
import { obtenerTurnosTicketsParaUsuario, obtenerCentrosAtencion } from '../../lib/servicios';
import { ContextoEstados } from '../../lib/contextoEstados';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import Teja from '../../componentes/comunes/teja';
import TejaChica from '../../componentes/comunes/tejaChica';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { ContextoIdiomas } from '../../lib/contextoIdioma';
import { ContextoDialogoEmergente } from '../../lib/contextoDialogoEmergente';
import {
  procesarMensajeError,
  esTokenValido,
  crearClienteFirebase
} from '../../lib/ayudante';
import BotonRipple from '../../componentes/comunes/botonRipple';

const TipoTurno = {
  turnoFila: 1,
  turnoAgendado: 2,
};

const Lobby = ({ navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { textosGlobales } = useContext(ContextoIdiomas);
  const {
    estadoLogin,
    estadoCentros,
    estadoTurnosActivos,
    estadoTurnosAgendadosActivos,
    estadoFbToken,
    estadoTemaUsuario,
    estadoIdiomaUsuario,
    fijarTurnosEnEstado,
    fijarTodosTurnosEnEstado,
    fijarCentrosEnEstado,
    cambiarTokenFirebaseEnEstado,
    fijarUsuarioLogueadoEnEstado,
    fijarTurnoActualEnEstado,
    asignarEstadoIrEvaluacion
  } = useContext(ContextoEstados);
  const { abrirDialogoEmergente } = useContext(ContextoDialogoEmergente);
  const [cargando, fijarCargando] = useState(true);
  const [mostrarTurnosFilas, cambiarMostrarTurnosFilas] = useState(true);

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: estilosGlobales.colorFondoGlobal,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    contenedorCarga: {
      flex: 1,
      backgroundColor: estilosGlobales.colorFondoGlobal,
      justifyContent: 'center',
    },
    encabezado: {
      height: 23,
      width: '100%',
      backgroundColor: estilosGlobales.colorBarraNavegacion,
    },
    texto: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: 14,
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
      flex: 1.5,
      paddingTop: 40,
    },
    centro: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: 15,
      textAlign: 'center',
      paddingLeft: 4,
      paddingRight: 4,
      fontWeight: 'bold',
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 225,
      width: '100%',
      zIndex: 1,
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
      abrirDialogoEmergente,
      textosGlobales,
    );
    // --- Fin Firebase ----

    const consultarCentros = () => {
      if (estadoCentros == null || estadoCentros.centros?.length === 0) {
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
              estadoTemaUsuario,
              estadoIdiomaUsuario,
            )) {
              Alert.alert(procesarMensajeError(error.message, 'Error durante la carga de centros.'));
            }
          });
      }
    };

    const consultarTurnosTicketsDeUsuario = () => obtenerTurnosTicketsParaUsuario(estadoLogin.token)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta.success) {
          fijarTodosTurnosEnEstado(respuesta.response?.tickets, respuesta.response?.turns);
          fijarCargando(false);
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
          estadoTemaUsuario,
          estadoIdiomaUsuario,
        )) {
          Alert.alert(procesarMensajeError(error.message, 'Error durante la carga de turnos activos.'));
        }
      });

    consultarCentros();
    consultarTurnosTicketsDeUsuario();

    // Configura un intervalo de consulta para refrescar los turnos cada 1 minuto.
    const idIntervalo = setInterval(() => {
      consultarTurnosTicketsDeUsuario();
    }, 60000);
    // Cuando el usuario abandona la pantalla limpia el intervalo.
    return () => {
      clearInterval(idIntervalo);
    };
  }, []);

  const seleccionarTurnoActivo = (turno, tipoTurno) => {
    fijarTurnoActualEnEstado(turno, null);
    navigation.navigate(tipoTurno === TipoTurno.turnoFila ? 'Turno' : 'TurnoAgendado');
  };

  if (cargando) {
    return (
      <View style={estilos.contenedorCarga}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  const ListadoCentros = () => (
    <View style={estilos.contenedorCentros}>
      <ScrollView horizontal showsVerticalScrollIndicator={false}>
        { estadoCentros?.centros?.map(centro => (
          <TejaChica
            key={centro.id}
            appIcon={centro.app_icon}
            manejadorClick={() => navigation.navigate('CentroAtencion', { centro })}
          >
            <Text multiline editable={false} style={estilos.texto}>{centro.name}</Text>
          </TejaChica>
        ))}
      </ScrollView>
    </View>
  );

  const TabsDeTurnos = () => (
    <View style={estilos.subContenedorTitulo}>
      <BotonRipple
        height={55}
        width="47%"
        colorFondo={`${mostrarTurnosFilas ? '#8B6CC6' : '#F1F1F1'}`}
        colorBorde={`${mostrarTurnosFilas ? '#8B6CC6' : '#F1F1F1'}`}
        elevacion={5}
        manejadorClick={() => cambiarMostrarTurnosFilas(true)}
        borderRadius={0}
        borderTopLeftRadius={10}
        borderBottomLeftRadius={10}
      >
        <Text
          style={{
            ...estilosGlobales.tituloSeccionClaro,
            color: mostrarTurnosFilas ? '#ffffff' : '#8B6CC6',
          }}
        >
          {textosGlobales.lobbyTurnosFila}
        </Text>
      </BotonRipple>
      <BotonRipple
        height={55}
        width="47%"
        colorFondo={`${!mostrarTurnosFilas ? '#8B6CC6' : '#F1F1F1'}`}
        colorBorde={`${!mostrarTurnosFilas ? '#8B6CC6' : '#F1F1F1'}`}
        elevacion={5}
        manejadorClick={() => cambiarMostrarTurnosFilas(false)}
        borderRadius={0}
        borderTopRightRadius={10}
        borderBottomRightRadius={10}
      >
        <Text
          style={{
            ...estilosGlobales.tituloSeccionClaro,
            color: !mostrarTurnosFilas ? '#ffffff' : '#8B6CC6',
          }}
        >
          {textosGlobales.lobbyTurnosAgendados}
        </Text>
      </BotonRipple>
    </View>
  );

  const TurnosFilaPedidos = () => (
    estadoTurnosActivos?.length > 0
      ? (
        <View style={estilos.contenedorTurnos}>
          <ScrollView showsVerticalScrollIndicator={false}>
            { estadoTurnosActivos?.map(turno => (
              <Teja
                key={turno.id}
                appIcon={turno.Center.app_icon}
                manejadorClick={() => seleccionarTurnoActivo(turno, TipoTurno.turnoFila)}
              >
                <View style={estilos.contenedorHijos}>
                  <View style={{ flex: 0.7, justifyContent: 'center' }}>
                    <Text style={estilos.centro}>{turno.Center.name}</Text>
                    <Text style={estilos.categoria}>{turno.Category.name}</Text>
                  </View>
                  <View style={{ flex: 0.3, justifyContent: 'flex-end' }}>
                    <Text style={turno.status === 'waiting' ? estilos.espera : estilos.enLugar}>
                      {turno.status === 'waiting' ? textosGlobales.lobbyEsperando : textosGlobales.lobbyEnElLugar}
                    </Text>
                  </View>
                </View>
              </Teja>
            ))}
          </ScrollView>
        </View>
      )
      : (
        <View style={estilos.contenedorTurnos}>
          <Text style={{ color: '#ffffff', fontSize: 18, marginTop: 20 }}>{textosGlobales.lobbyNoHayTurnosFila}</Text>
        </View>
      )
  );

  const TurnosAgendadosPedidos = () => (
    estadoTurnosAgendadosActivos?.length > 0
      ? (
        <View style={estilos.contenedorTurnos}>
          <ScrollView showsVerticalScrollIndicator={false}>
            { estadoTurnosAgendadosActivos?.map(turno => {
              const fechaTurnoArreglo = turno.turno_date.split('-');
              const fechaConFormato = `${fechaTurnoArreglo[2]}/${fechaTurnoArreglo[1]}/${fechaTurnoArreglo[0]}`;
              return (
                <Teja
                  key={turno.id}
                  appIcon={turno.Center.app_icon}
                  manejadorClick={() => seleccionarTurnoActivo(turno, TipoTurno.turnoAgendado)}
                >
                  <View style={estilos.contenedorHijos}>
                    <Text style={estilos.centro}>{turno.Center.name}</Text>
                    <Text style={estilos.categoria}>{turno.Category.name}</Text>
                    <Text style={estilos.categoria}>
                      {`${textosGlobales.lobbyFecha}: ${fechaConFormato}`}
                    </Text>
                    <Text style={estilos.categoria}>
                      {`${textosGlobales.lobbyHora}: ${turno.turno_time}`}
                    </Text>
                  </View>
                </Teja>
              );
            })}
          </ScrollView>
        </View>
      )
      : (
        <View style={estilos.contenedorTurnos}>
          <Text style={{ color: '#ffffff', fontSize: 18, marginTop: 20 }}>{textosGlobales.lobbyNoHayTurnosAgendados}</Text>
        </View>
      )
  );

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.encabezado} />
      <View style={estilos.contenedorTituloCentros} elevation={5}>
        <Text style={estilosGlobales.tituloSeccion}>{textosGlobales.lobbyMensajeSacarTurno}</Text>
      </View>
      <ListadoCentros />

      <TabsDeTurnos />
      { mostrarTurnosFilas
        ? <TurnosFilaPedidos />
        : <TurnosAgendadosPedidos />}
    </View>
  );
};

export default withErrorBoundary('Error iniciando sesión.', withDialogoEmergente(Lobby));
