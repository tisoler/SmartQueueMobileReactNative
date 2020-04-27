// @flow
import React, { useEffect, useContext } from 'react';
import {
  View, StyleSheet, Alert, ActivityIndicator, Text, ScrollView
} from 'react-native';
import { obtenerTicketsParaUsuario } from '../../lib/servicios';
import { ContextoStates } from '../../lib/contextoStates';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import ImagenLink from '../../componentes/comunes/imagenLink';

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0084a8',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10
  },
  contenedorTurnos: {
    flex: 0.45,
    backgroundColor: '#0084a8',
    flexDirection: 'row'
  },
  titulo: {
    fontSize: 22,
    paddingBottom: 10,
    paddingTop: 15,
    fontWeight: 'bold',
    color: '#FFF'
  }
});

const Lobby = ({ navigation }) => {
  const { loginState, loginDispatch } = useContext(ContextoStates);
  const { turnosActivos } = loginState;
  useEffect(() => {
    obtenerTicketsParaUsuario(loginState.token)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta.success) {
          loginDispatch({
            type: 'SET_TURNOS_ACTIVOS',
            payload: { turnosActivos: respuesta.response }
          });
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
          <ScrollView horizontal scr>
            { turnosActivos.map(turno => (
              <ImagenLink
                key={turno.id}
                AppIcon={turno.Center.app_icon}
                ManejadorClick={() => seleccionarTurnoActivo(turno)}
                Texto={turno.Center.name}
              />
            ))}
          </ScrollView>
        </View>
      )}
      <BotonRedondeado ManejadorClick={() => pedirTurno()} Cargando={false} Color="#fff">
        Pedir nuevo turno
      </BotonRedondeado>
    </View>
  );
};

export default withErrorBoundary('Error iniciando sesión.', Lobby);
