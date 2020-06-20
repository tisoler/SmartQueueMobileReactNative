// @flow
import React, { useEffect, useState, useContext } from 'react';
import {
  View, StyleSheet, Text, Image, ActivityIndicator, Alert
} from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import { IconosCentros } from '../../lib/constantes';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstados } from '../../lib/contextoEstados';
import { estimarDemora, cancelarTicket, confirmarAsistencia } from '../../lib/servicios';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { recuperarMensajeError } from '../../lib/ayudante';

const Turno = ({ route, navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { turno } = route.params;
  const {
    estadoLogin,
    estadoTurnoActual,
    cancelarTurnoEnEstado,
    confirmarAsistenciaTurnoEnEstado,
    fijarTurnoActualEnEstado
  } = useContext(ContextoEstados);
  const { demora: demoraActual } = estadoTurnoActual;
  const [confirmoPresencia, cambiarConfirmoPresencia] = useState(false);
  const [cargando, cambiarCargando] = useState(true);
  const [confirmandoTurno, cambiarConfirmandoTurno] = useState(false);

  let colorFondo = estilosGlobales.colorFondoContenedorDatos;
  // eslint-disable-next-line camelcase
  if (demoraActual?.tickets <= 10 && demoraActual?.tickets_ready <= 3) {
    colorFondo = '#04512E';
  // eslint-disable-next-line camelcase
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
      marginTop: 8,
    },
    margenUltimoTexto: {
      marginBottom: 20
    },
    textoTurno: {
      fontSize: 19,
      color: '#fff',
      marginTop: 5
    }
  });

  useEffect(() => {
    const consultarDemora = () => {
      estimarDemora(estadoLogin?.token, turno?.Category?.id, turno?.Center?.id)
        .then(res => res.json())
        .then(respuesta => {
          fijarTurnoActualEnEstado(turno, respuesta?.response?.wait);
          cambiarCargando(false);
          if (turno.status === 'ready') {
            cambiarConfirmoPresencia(true);
          }
        })
        .catch((error) => Alert.alert(recuperarMensajeError(error.message, 'Error en la solicitud de turno.')));
    };
    // Si viene de crear el turno usa la misma demora que le informaó en la pantalla anterior.
    // Si está consultando un turno llama al estimador de demora.
    if (!demoraActual) {
      consultarDemora();
    } else {
      cambiarCargando(false);
    }
    // Configura un intervalo de consulta para refrescar la demora cada 2 minutos.
    const idIntervalo = setInterval(() => {
      consultarDemora();
    }, 60000);
    // Cuando el usuario abandona la pantalla limpia el intervalo.
    return () => {
      clearInterval(idIntervalo);
    };
  }, []);

  const cancelarTurno = () => {
    cambiarCargando(true);
    cancelarTicket(estadoLogin.token, turno.Center.id)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta.success) {
          cancelarTurnoEnEstado(turno);
          navigation.navigate('Lobby');
        } else {
          Alert.alert('Error al cancelar el turno.');
        }
      })
      .catch((error) => Alert.alert(recuperarMensajeError(error.message, 'Error al cancelar el turno.')));
  };

  const confirmarPresencia = () => {
    cambiarConfirmandoTurno(true);
    confirmarAsistencia(estadoLogin.token, turno.Center.id)
      .then(res => res.json())
      .then(() => {
        confirmarAsistenciaTurnoEnEstado(turno);
        cambiarConfirmoPresencia(true);
      })
      .catch((error) => {
        Alert.alert(recuperarMensajeError(error.message, 'Error al confirmar presencia.'));
        cambiarConfirmoPresencia(false);
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

  const obtenerVista = () => (
    <View style={estilos.subContenedor}>
      <Text style={estilosGlobales.tituloGrande}>{turno.code}</Text>
      <Text style={estilosGlobales.subtituloGrande}>
        {turno.Category.name}
      </Text>
      <Text style={estilos.textoTurno}>
        {`Turnos antes: ${demoraActual?.tickets || '?'}`}
      </Text>
      <Text style={[estilos.textoTurno, estilos.margenUltimoTexto]}>
        {`Tiempo estimado: ${demoraActual?.hours || '?'} hs. ${demoraActual?.minutes || '?'} minutos`}
      </Text>
      { !confirmoPresencia ? (
        obtenerAccionesTurno()
      ) : (
        obtenerSaludo()
      )}
    </View>
  );

  if (cargando) {
    return (
      <View style={estilos.contenedor}>
        <Image
          style={estilosGlobales.imagenLogoCentro}
          source={IconosCentros[turno.Center.app_icon]}
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

export default withErrorBoundary('Error en turno.', Turno);
