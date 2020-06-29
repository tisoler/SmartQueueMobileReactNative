/* eslint-disable camelcase */
// @flow
import React, { useEffect, useState, useContext } from 'react';
import {
  View, StyleSheet, Text, Image, ActivityIndicator, Alert
} from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import { IconosCentros } from '../../lib/constantes';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstados } from '../../lib/contextoEstados';
import { cancelarTicket, confirmarAsistencia } from '../../lib/servicios';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { procesarMensajeError, esTokenValido } from '../../lib/ayudante';
import recuperarTicket from './llamadasServicioComunes';

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

  let colorFondo = estilosGlobales.colorFondoContenedorDatos;
  if (demoraActual?.tickets <= 10 && demoraActual?.tickets_ready <= 3) {
    colorFondo = '#04512E';
  } else if (demoraActual?.tickets <= 10 && demoraActual?.tickets_ready <= 5) {
    colorFondo = '#8D8002';
  }

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colorFondo,
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    },
    subContenedor: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '95%'
    },
    subContenedorSaludo: {
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#0A5164',
      width: '95%',
      paddingTop: 5,
      paddingBottom: 10,
      marginTop: 5
    },
    subContenedorTurno: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '85%',
      borderWidth: 2,
      borderColor: '#0A5164',
      marginBottom: 4,
      paddingBottom: 4
    },
    margenUltimoTexto: {
      marginBottom: 15
    },
    textoTurno: {
      fontSize: 19,
      color: '#fff',
      marginTop: 3,
      textAlign: 'center'
    }
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

  const obtenerSaludo = () => (
    <View style={estilos.subContenedorSaludo}>
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

  const obtenerVista = () => (
    <View style={estilos.subContenedor}>
      <View style={estilos.subContenedorTurno}>
        <Text style={estilosGlobales.subtituloGrande}>{turno?.Center?.name}</Text>
        <Text style={estilosGlobales.tituloGrande}>{turno?.code}</Text>
        <Text style={estilosGlobales.subtituloGrande}>
          {turno?.Category?.name}
        </Text>
      </View>
      <Text style={estilos.textoTurno}>{mensajeTurnosAnteriores}</Text>
      <Text style={estilos.textoTurno}>{mensajePersonasEnLugar}</Text>
      <Text style={[estilos.textoTurno, estilos.margenUltimoTexto]}>
        {`La demora estimada es de ${demoraActual?.hours > 0 ? `${demoraActual?.hours} hs.` : ''} ${demoraActual?.minutes ? parseInt(demoraActual.minutes, 10) : '?'} minutos.`}
      </Text>
      { turno?.status === 'ready' ? (
        obtenerSaludo()
      ) : (
        obtenerAccionesTurno()
      )}
    </View>
  );

  if (cargando || !turno?.code) {
    return (
      <View style={estilos.contenedor}>
        <Image
          style={estilosGlobales.imagenLogoCentro}
          source={IconosCentros[turno?.Center?.app_icon]}
        />
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Image
        style={estilosGlobales.imagenLogoCentro}
        source={IconosCentros[turno.Center.app_icon]}
      />
      { obtenerVista() }
    </View>
  );
};

export default withErrorBoundary('Error en turno.', withDialogoEmergente(Turno));
