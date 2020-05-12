// @flow
import React, { useEffect, useContext } from 'react';
import {
  View, StyleSheet, Alert, ActivityIndicator, Text, ScrollView, Dimensions
} from 'react-native';
import { obtenerTicketsParaUsuario } from '../../lib/servicios';
import { ContextoStates } from '../../lib/contextoStates';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import Teja from '../../componentes/comunes/teja';
import { setearTurnosActivos } from './usuarioAcciones';

const Lobby = ({ navigation }) => {
  const { loginState, loginDispatch } = useContext(ContextoStates);
  const { turnosActivos } = loginState;
  useEffect(() => {
    obtenerTicketsParaUsuario(loginState.token)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta.success) {
          setearTurnosActivos(loginDispatch, respuesta.response);
          if (respuesta.response.some(turno => turno.status === 'finished')) {
            navigation.navigate('EvaluacionTurno');
          }
        } else {
          Alert.alert('Error durante la carga de turnos activos.');
        }
      })
      .catch(() => Alert.alert('Error durante la carga de turnos activos.'));
  }, []);

  const pedirTurno = () => {
    navigation.navigate('ListaCentrosAtencion');
  };

  const seleccionarTurnoActivo = (turno) => {
    navigation.navigate('Turno', { turno });
  };

  const maximoTejas = Math.round(Dimensions.get('window').height / 100) - 3;

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: '#0084a8',
      flexDirection: 'column',
      alignItems: 'center'
    },
    contenedorTurnos: {
      backgroundColor: '#026F8E',
      width: '100%',
      marginBottom: 8,
      height: turnosActivos?.length <= maximoTejas
        ? turnosActivos.length * 100
        : (maximoTejas * 100) + 18
    },
    titulo: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FFF',
      lineHeight: 50,
      textAlign: 'center'
    },
    centro: {
      color: '#FFF',
      fontSize: 19,
      paddingLeft: 10
    },
    categoria: {
      color: '#FFF',
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
  });

  if (turnosActivos == null) {
    return (
      <View style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>
        { turnosActivos.length > 0 ? 'Turnos pedidos:' : 'Usted no tiene turnos pedidos' }
      </Text>
      { turnosActivos.length > 0 && (
        <View style={estilos.contenedorTurnos}>
          <ScrollView>
            { turnosActivos.map(turno => (
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
      <BotonRedondeado manejadorClick={() => pedirTurno()}>
        NUEVO TURNO
      </BotonRedondeado>
    </View>
  );
};

export default withErrorBoundary('Error iniciando sesión.', Lobby);
