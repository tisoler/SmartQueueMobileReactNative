// @flow
import React, { useEffect, useState, useContext } from 'react';
import {
  View, StyleSheet, Text, Image, ActivityIndicator, Alert
} from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import { iconosCentros } from '../../lib/constantes';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoStates } from '../../lib/contextoStates';
import { estimarDemora, cancelarTicket, confirmarAsistencia } from '../../lib/servicios';
import { cancelarTurnoState, confirmarAsistenciaTurnoState } from '../usuario/usuarioAcciones';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';

const Turno = ({ route, navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { turno, demoraTurnoCreado } = route.params;
  const { loginState, loginDispatch } = useContext(ContextoStates);
  const [demora, setDemora] = useState(null);
  const [confirmoPresencia, setConfirmoPresencia] = useState(false);
  const [cargando, setCargando] = useState(true);
  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: estilosGlobales.colorFondoContenedorDatos,
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
    // Si viene de crear el turno usa la misma demora que le informaó en la pantalla anterior.
    // Si está consultando un turno llama al estimador de demora.
    if (demoraTurnoCreado == null) {
      estimarDemora(loginState.token, turno.Category.id, turno.Center.id)
        .then(res => res.json())
        .then(respuesta => {
          setDemora(respuesta.response.wait);
          setCargando(false);
          if (turno.status === 'ready') {
            setConfirmoPresencia(true);
          }
        })
        .catch(() => Alert.alert('Error en la solicitud de turno.'));
    } else {
      setDemora(demoraTurnoCreado);
      setCargando(false);
    }
  }, []);

  const cancelarTurno = () => {
    setCargando(true);
    cancelarTicket(loginState.token, turno.Center.id)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta.success) {
          cancelarTurnoState(loginDispatch, turno);
          navigation.navigate('Lobby');
        } else {
          Alert.alert('Error al cancelar el turno.');
        }
      })
      .catch(() => Alert.alert('Error al cancelar el turno.'));
  };

  const confirmarPresencia = () => {
    confirmarAsistencia(loginState.token, turno.Center.id)
      .then(res => res.json())
      .then(() => {
        confirmarAsistenciaTurnoState(loginDispatch, turno);
        setConfirmoPresencia(true);
      })
      .catch(() => {
        Alert.alert('Error al confirmar presencia.');
        setConfirmoPresencia(false);
      });
  };

  const obtenerAccionesTurno = () => (
    <View style={estilos.subContenedor}>
      <BotonRedondeado manejadorClick={() => confirmarPresencia()} estilo={{ marginTop: 10 }}>
        YA ESTOY AQUÍ
      </BotonRedondeado>
      <BotonRedondeado manejadorClick={() => cancelarTurno()} estilo={{ marginTop: 22 }}>
        CANCELAR TURNO
      </BotonRedondeado>
    </View>
  );

  const obtenerSaludo = () => (
    <View style={estilos.subContenedorSaludo}>
      <Text style={estilosGlobales.tituloGrande}>Bienvenida/o.</Text>
      <Text style={estilosGlobales.subtituloGrande}>
        Ya hemos recibido la notificación de su llegada.
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
        {`Turnos antes: ${demora ? demora.tickets : ''}`}
      </Text>
      <Text style={[estilos.textoTurno, estilos.margenUltimoTexto]}>
        {`Tiempo estimado: ${demora ? demora.hours : ''} hs. ${demora ? demora.minutes : ''} minutos`}
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
          source={iconosCentros[turno.Center.app_icon]}
        />
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Image
        style={estilosGlobales.imagenLogoCentro}
        source={iconosCentros[turno.Center.app_icon]}
      />
      { obtenerVista() }
    </View>
  );
};

export default withErrorBoundary('Error en turno.', Turno);
