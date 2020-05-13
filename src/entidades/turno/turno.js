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

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0084a8',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  subContenedor: {
    alignItems: 'center',
    width: '95%'
  },
  subContenedorSaludo: {
    alignItems: 'center',
    width: '95%',
    borderColor: '#005f79',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 10
  },
  imagen: {
    height: 150,
    width: 150
  },
  titulo: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold'
  },
  subtitulo: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
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

const Turno = ({ route, navigation }) => {
  const { turno, demoraTurnoCreado } = route.params;
  const { loginState, loginDispatch } = useContext(ContextoStates);
  const [demora, setDemora] = useState(null);
  const [confirmoPresencia, setConfirmoPresencia] = useState(false);
  const [cargando, setCargando] = useState(true);

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
      <BotonRedondeado manejadorClick={() => confirmarPresencia()}>
        YA ESTOY AQUÍ
      </BotonRedondeado>
      <BotonRedondeado manejadorClick={() => cancelarTurno()}>
        CANCELAR TURNO
      </BotonRedondeado>
    </View>
  );

  const obtenerSaludo = () => (
    <View style={estilos.subContenedorSaludo}>
      <Text style={estilos.titulo}>Bienvenida/o.</Text>
      <Text style={estilos.subtitulo}>Ya hemos recibido la notificación de su llegada.</Text>
    </View>
  );

  const obtenerVista = () => (
    <View style={estilos.subContenedor}>
      <Text style={estilos.titulo}>{turno.code}</Text>
      <Text style={estilos.subtitulo}>
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
        <Image style={estilos.imagen} source={iconosCentros[turno.Center.app_icon]} />
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Image style={estilos.imagen} source={iconosCentros[turno.Center.app_icon]} />
      { obtenerVista() }
    </View>
  );
};

export default withErrorBoundary('Error en turno.', Turno);
