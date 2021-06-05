/* eslint-disable camelcase */
// @flow
import React, { useEffect, useState, useContext } from 'react';
import {
  View, StyleSheet, Text, ActivityIndicator, Alert, Animated, Dimensions,
} from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstados } from '../../lib/contextoEstados';
import { cancelarTurno, confirmarAsistenciaTurno, obtenerTurnosParaUsuario } from '../../lib/servicios';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { ContextoIdiomas } from '../../lib/contextoIdioma';
import { procesarMensajeError, esTokenValido } from '../../lib/ayudante';
import recuperarTurno from './llamadasServicioComunes';
import Teja from '../../componentes/comunes/teja';
import Turnos from '../../componentes/comunes/svg/turnos';
import Reloj from '../../componentes/comunes/svg/reloj';

const TurnoAgendado = ({ navigation }) => {
  const {
    estadoLogin,
    estadoTurnoActual,
    estadoFbToken,
    estadoTemaUsuario,
    estadoIdiomaUsuario,
    removerTurnoAgendadoEnEstado,
    fijarTurnoActualEnEstado,
    fijarUsuarioLogueadoEnEstado,
    fijarTurnosAgendadosEnEstado,
  } = useContext(ContextoEstados);
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { textosGlobales } = useContext(ContextoIdiomas);
  const { turno, demora: demoraActual } = estadoTurnoActual;
  const [confirmandoTurno, cambiarConfirmandoTurno] = useState(false);
  const [cargando, cambiarCargando] = useState(true);
  const [opacidadBienvenida] = useState(new Animated.Value(0.01));
  const topInicial = Math.round(Dimensions.get('window')?.height);
  const [posicionPantallaCancelar] = useState(new Animated.Value(topInicial));
  const [opacidadPantallaCancelar] = useState(new Animated.Value(0.01));

  let colorFondo = estilosGlobales.colorBarraNavegacion;
  if (demoraActual?.tickets <= 10 && demoraActual?.tickets_ready <= 3) {
    colorFondo = '#2EBC0B';
  } else if (demoraActual?.tickets <= 10 && demoraActual?.tickets_ready <= 5) {
    colorFondo = '#F6E252';
  }

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: '#ffffff',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    },
    subContenedor: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '85%',
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      padding: 10,
    },
    subContenedorInformacion: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '85%',
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      padding: 10,
    },
    subContenedorColor: {
      width: 20,
      backgroundColor: colorFondo,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
    },
    subContenedorSaludo: {
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#8B6CC6',
      width: '90%',
      padding: 10,
      marginTop: 20,
      borderRadius: 10,
    },
    margenUltimoTexto: {
      marginBottom: 15
    },
    textoTurno: {
      fontSize: 17,
      color: estilosGlobales.colorTextoGeneral,
      marginTop: 3,
      marginLeft: 5,
      width: '95%',
      lineHeight: 25,
      paddingLeft: 10,
      paddingRight: 10,
    },
    contenedorTurno: {
      backgroundColor: estilosGlobales.colorFondoGlobal,
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingBottom: 30,
      paddingTop: 30,
    },
    contenedorHijos: {
      flex: 2,
      flexDirection: 'column',
    },
    centro: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: 19,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingLeft: 4,
      paddingRight: 4,
    },
    categoria: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: 17,
      textAlign: 'center',
    },
    pantallaTurnoCancelado: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      flexDirection: 'column',
      backgroundColor: '#8B6CC6',
    },
    contenedorCampos: {
      flexGrow: 3,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    subtituloGrande: {
      color: '#ffffff',
      fontSize: 22,
      textAlign: 'center',
      lineHeight: 25,
    },
  });

  const animacionOpacidadBienvenida = () => {
    Animated.timing(opacidadBienvenida, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const animacionPosicionPantallaCancelar = () => {
    Animated.timing(posicionPantallaCancelar, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const animacionOpacidadPantallaCancelar = () => {
    Animated.timing(opacidadPantallaCancelar, {
      toValue: 1,
      duration: 700,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (turno) animacionOpacidadBienvenida();
  }, [turno]);

  const refrescarTurnosAgendados = async () => {
    const res = await obtenerTurnosParaUsuario(estadoLogin.token);
    const respuesta = await res.json();
    if (respuesta.success) {
      fijarTurnosAgendadosEnEstado(respuesta.response);
    }
  };

  useEffect(() => {
    const consultarTurno = async () => {
      await recuperarTurno(
        estadoLogin,
        estadoFbToken,
        estadoTurnoActual,
        estadoTemaUsuario,
        estadoIdiomaUsuario,
        fijarTurnoActualEnEstado,
        fijarTurnosAgendadosEnEstado,
        fijarUsuarioLogueadoEnEstado,
        navigation
      );
      cambiarCargando(false);
    };

    consultarTurno();
    // Cuando se toma un turno necesitamos refrescar la lista
    refrescarTurnosAgendados();

    // Configura un intervalo de consulta para refrescar la demora cada 1 minuto.
    const idIntervalo = setInterval(() => {
      consultarTurno();
    }, 60000);
    // Cuando el usuario abandona la pantalla limpia el intervalo.
    return () => {
      clearInterval(idIntervalo);
    };
    // Vuelve a cargar el useEffect si cambia el code
    // (para cuando una notificación llama a la pantalla Turno desde la misma pantalla Turno,
    // code vendrá undefined primero)
  }, [turno?.code]);

  const cancelarTurnoAgendado = () => {
    // cambiarCargando(true);
    cancelarTurno(estadoLogin.token, turno.Center.id)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta.success) {
          animacionPosicionPantallaCancelar();
          setTimeout(() => {
            animacionOpacidadPantallaCancelar();
            setTimeout(() => {
              removerTurnoAgendadoEnEstado(turno);
              navigation.navigate('Lobby');
            }, 1000);
          }, 1000);
        } else {
          Alert.alert('Error al cancelar el turno.');
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
          Alert.alert(procesarMensajeError(error.message, 'Error al cancelar el turno.'));
        }
      });
  };

  const confirmarPresencia = () => {
    cambiarConfirmandoTurno(true);
    confirmarAsistenciaTurno(estadoLogin.token, turno.Center.id)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta.success) {
          // Cambia status en el turno localmente.
          turno.status = 'ready';
        } else {
          Alert.alert('Error al confirmar el turno.');
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
          Alert.alert(procesarMensajeError(error.message, 'Error al confirmar presencia.'));
        }
      })
      .finally(() => cambiarConfirmandoTurno(false));
  };

  const AccionesTurno = (
    <View style={estilos.subContenedor}>
      <BotonRedondeado
        manejadorClick={confirmarPresencia}
        cargando={confirmandoTurno}
        estilo={{ marginTop: 20 }}
        width="100%"
      >
        {textosGlobales.turnoAgendadoYaEstoyAqui}
      </BotonRedondeado>
      { !confirmandoTurno && (
        <BotonRedondeado
          manejadorClick={cancelarTurnoAgendado}
          estilo={{ marginTop: 22 }}
          width="100%"
          colorBorde={estilosGlobales.colorEfectoClickBotonSecundario}
          colorFondo="#ffffff"
          colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
          colorTexto={estilosGlobales.colorFondoBotonPrincipal}
        >
          {textosGlobales.turnoAgendadoCancelar}
        </BotonRedondeado>
      )}
    </View>
  );

  const SaludoBienvenida = (
    <Animated.View
      style={{
        ...estilos.subContenedorSaludo,
        opacity: opacidadBienvenida,
        display: turno?.status !== 'ready' ? 'none' : 'flex'
      }}
      elevation={5}
    >
      <Text style={estilosGlobales.tituloGrande}>{textosGlobales.turnoAgendadoBienvenida}</Text>
      <Text style={estilosGlobales.subtituloGrande}>
        {textosGlobales.turnoAgendadoMensajeArrivo1}
      </Text>
      <Text style={estilosGlobales.subtituloGrande}>
        {textosGlobales.turnoAgendadoMensajeArrivo2}
      </Text>
    </Animated.View>
  );

  const TicketTurno = () => (
    <View style={estilos.contenedorTurno}>
      <Teja
        key={turno.id}
        appIcon={turno.Center.app_icon}
        height={120}
        width={300}
      >
        <View style={estilos.contenedorHijos}>
          <Text style={estilos.centro}>{turno.Center.name}</Text>
          <Text style={estilos.categoria}>{turno.Category.name}</Text>
        </View>
      </Teja>
    </View>
  );

  const PantallaCancelarTurno = (
    <Animated.View style={{ ...estilos.pantallaTurnoCancelado, top: posicionPantallaCancelar }}>
      <Animated.View style={{ ...estilos.contenedorCampos, opacity: opacidadPantallaCancelar }}>
        <Text style={estilos.subtituloGrande}>
          {textosGlobales.turnoAgendadoCancelado}
        </Text>
      </Animated.View>
    </Animated.View>
  );

  if (cargando || !turno?.turno_date) {
    return (
      <View style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  const fechaTurnoArreglo = turno.turno_date.split('-');
  const fechaConFormato = `${fechaTurnoArreglo[2]}/${fechaTurnoArreglo[1]}/${fechaTurnoArreglo[0]}`;

  return (
    <View style={{ flex: 1 }}>
      <View style={estilos.contenedor}>
        <TicketTurno />
        <View style={{
          display: 'flex', flexDirection: 'row', marginTop: 20, height: 150,
        }}
        >
          <View style={estilos.subContenedorInformacion} elevation={5}>
            <View style={{
              display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center',
            }}
            >
              <Turnos width={20} height={20} color={estilosGlobales.colorTextoGeneral} />
              <Text style={estilos.textoTurno}>
                {`${textosGlobales.turnoSuTurnoEs} ${fechaConFormato} ${textosGlobales.turnoALas} ${turno.turno_time}.`}
              </Text>
            </View>
            <View style={{
              display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center',
            }}
            >
              <Reloj width={20} height={20} color={estilosGlobales.colorTextoGeneral} />
              <Text style={[estilos.textoTurno, estilos.margenUltimoTexto]}>
                {textosGlobales.turnoRecordatorio}
              </Text>
            </View>
          </View>
          <View style={estilos.subContenedorColor} elevation={5} />
        </View>
        { SaludoBienvenida }
        { turno?.status !== 'ready' && AccionesTurno }
      </View>
      { PantallaCancelarTurno }
    </View>
  );
};

export default withErrorBoundary('Error en turno.', withDialogoEmergente(TurnoAgendado));
