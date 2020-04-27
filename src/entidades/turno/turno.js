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

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0084a8',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
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
    fontWeight: 'bold'
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
  const { loginState } = useContext(ContextoStates);
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
        })
        .catch(() => Alert.alert('Error en la solicitud de turno.'));
    } else {
      setDemora(demoraTurnoCreado);
      setCargando(false);
    }
  }, []);

  const cancelarTurno = () => {
    setCargando(true);
    cancelarTicket(loginState.token, turno.id)
      .then(res => res.json())
      .then(() => {
        navigation.pop(2);
      })
      .catch(() => Alert.alert('Error al cancelar el turno.'));
  };

  const confirmarPresencia = () => {
    setConfirmoPresencia(true);
    confirmarAsistencia(loginState.token, turno.Center.id)
      .then(res => res.json())
      .then(() => {
        setTimeout(() => navigation.pop(2), 1500);
      })
      .catch(() => {
        Alert.alert('Error al confirmar presencia.');
        setConfirmoPresencia(false);
      });
  };

  const obtenerVistaTurno = () => (
    <View style={estilos.container}>
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
      <BotonRedondeado ManejadorClick={() => confirmarPresencia()} Cargando={false} Color="#fff">
        YA ESTOY AQUÍ
      </BotonRedondeado>
      <BotonRedondeado ManejadorClick={() => cancelarTurno()} Cargando={false} Color="#fff">
        CANCELAR TURNO
      </BotonRedondeado>
    </View>
  );

  const obtenerSaludo = () => (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Muchas gracias.</Text>
      <Text style={estilos.titulo}>Que tenga un buen día.</Text>
    </View>
  );

  const obtenerRender = () => {
    if (!confirmoPresencia) {
      if (cargando) {
        return <ActivityIndicator size="large" color="#fff" />;
      }
      return obtenerVistaTurno();
    }
    return obtenerSaludo();
  };

  return (
    <View style={estilos.container}>
      <Image style={estilos.imagen} source={iconosCentros[turno.Center.app_icon]} />
      { obtenerRender() }
    </View>
  );
};

export default withErrorBoundary('Error en turno.', Turno);
