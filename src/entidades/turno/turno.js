/* eslint-disable camelcase */
// @flow
import React, { useEffect, useState, useContext } from 'react';
import {
  View, StyleSheet, Text, ActivityIndicator, Alert
} from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstados } from '../../lib/contextoEstados';
import { cancelarTicket, confirmarAsistencia } from '../../lib/servicios';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { procesarMensajeError, esTokenValido } from '../../lib/ayudante';
import recuperarTicket from './llamadasServicioComunes';
import Teja from '../../componentes/comunes/teja';
import Turnos from '../../componentes/comunes/svg/turnos';
import Gente from '../../componentes/comunes/svg/gente';
import Reloj from '../../componentes/comunes/svg/reloj';

const Turno = ({ navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const {
    estadoLogin,
    estadoTurnoActual,
    estadoFbToken,
    estadoTemaUsuario,
    removerTurnoEnEstado,
    confirmarAsistenciaTurnoEnEstado,
    fijarTurnoActualEnEstado,
    fijarUsuarioLogueadoEnEstado,
    fijarTurnosEnEstado
  } = useContext(ContextoEstados);
  const { turno, demora: demoraActual } = estadoTurnoActual;
  const [confirmandoTurno, cambiarConfirmandoTurno] = useState(false);
  const [cargando, cambiarCargando] = useState(true);

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
      alignItems: 'flex-start',
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
  });

  useEffect(() => {
    const consultarTicket = async () => {
      await recuperarTicket(
        estadoLogin,
        estadoFbToken,
        estadoTurnoActual,
        estadoTemaUsuario,
        fijarTurnoActualEnEstado,
        fijarTurnosEnEstado,
        fijarUsuarioLogueadoEnEstado,
        navigation
      );
      cambiarCargando(false);
    };

    consultarTicket();

    // Configura un intervalo de consulta para refrescar la demora cada 1 minuto.
    const idIntervalo = setInterval(() => {
      consultarTicket();
    }, 60000);
    // Cuando el usuario abandona la pantalla limpia el intervalo.
    return () => {
      clearInterval(idIntervalo);
    };
    // Vuelve a cargar el useEffect si cambia el code
    // (para cuando una notificación llama a la pantalla Turno desde la misma pantalla Turno,
    // code vendrá undefined primero)
  }, [turno?.code]);

  const cancelarTurno = () => {
    cambiarCargando(true);
    cancelarTicket(estadoLogin.token, turno.Center.id)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta.success) {
          removerTurnoEnEstado(turno);
          navigation.navigate('Lobby');
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
          estadoTemaUsuario
        )) {
          Alert.alert(procesarMensajeError(error.message, 'Error al cancelar el turno.'));
        }
      });
  };

  const confirmarPresencia = () => {
    cambiarConfirmandoTurno(true);
    confirmarAsistencia(estadoLogin.token, turno.Center.id)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta.success) {
          confirmarAsistenciaTurnoEnEstado(turno);
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
          estadoTemaUsuario
        )) {
          Alert.alert(procesarMensajeError(error.message, 'Error al confirmar presencia.'));
        }
      })
      .finally(() => cambiarConfirmandoTurno(false));
  };

  const obtenerAccionesTurno = () => (
    <View style={estilos.subContenedor}>
      <BotonRedondeado
        manejadorClick={() => confirmarPresencia()}
        cargando={confirmandoTurno}
        estilo={{ marginTop: 10 }}
      >
        YA ESTOY AQUÍ
      </BotonRedondeado>
      { !confirmandoTurno && (
        <BotonRedondeado manejadorClick={() => cancelarTurno()} estilo={{ marginTop: 22 }}>
          CANCELAR TURNO
        </BotonRedondeado>
      )}
    </View>
  );

  const SaludoBienvenida = () => (
    <View style={estilos.subContenedorSaludo} elevation={5}>
      <Text style={estilosGlobales.tituloGrande}>Bienvenida/o.</Text>
      <Text style={estilosGlobales.subtituloGrande}>
        Ya hemos recibido la notificación de su llegada.
        Su turno aparecerá en pantalla y será atendido/a.
      </Text>
    </View>
  );

  const turnosAnteriores = demoraActual?.tickets != null ? demoraActual?.tickets : -1;
  // eslint-disable-next-line no-nested-ternary
  const mensajeTurnosAnteriores = turnosAnteriores === 1
    ? 'Hay 1 turno antes del suyo.'
    : turnosAnteriores > 1
      ? `Hay ${turnosAnteriores} turnos antes del suyo.`
      : 'No hay ningún turno antes del suyo.';
  const personasEnElLugar = demoraActual?.tickets_ready || -1;
  // eslint-disable-next-line no-nested-ternary
  const mensajePersonasEnLugar = personasEnElLugar === 1
    ? '1 persona con turno ya está en el lugar.'
    : personasEnElLugar > 1
      ? `${personasEnElLugar} personas con turno ya están en el lugar.`
      : 'Ninguna persona con turno está aún en el lugar.';

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
          <Text style={estilos.categoria}>{turno?.code}</Text>
        </View>
      </Teja>
    </View>
  );

  if (cargando || !turno?.code) {
    return (
      <View style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <TicketTurno />
      <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20, height: 150, }}>
        <View style={estilos.subContenedor} elevation={5}>
          <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', }}>
            <Turnos width={20} height={20} color={estilosGlobales.colorTextoGeneral} />
            <Text style={estilos.textoTurno}>{mensajeTurnosAnteriores}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', }}>
            <Gente width={20} height={20} color={estilosGlobales.colorTextoGeneral} />
            <Text style={estilos.textoTurno}>{mensajePersonasEnLugar}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', }}>
            <Reloj width={20} height={20} color={estilosGlobales.colorTextoGeneral} />
            <Text style={[estilos.textoTurno, estilos.margenUltimoTexto]}>
              {`La demora estimada es de ${demoraActual?.hours > 0 ? `${demoraActual?.hours} hs.` : ''} ${demoraActual?.minutes ? parseInt(demoraActual.minutes, 10) : '?'} minutos.`}
            </Text>
          </View>
        </View>
        <View style={estilos.subContenedorColor} elevation={5} />
      </View>
      { turno?.status === 'ready' ? (
        <SaludoBienvenida />
      ) : (
        obtenerAccionesTurno()
      )}
    </View>
  );
};

export default withErrorBoundary('Error en turno.', withDialogoEmergente(Turno));
