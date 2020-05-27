// @flow
import React, { useContext, useEffect } from 'react';
import {
  View, StyleSheet, ActivityIndicator, Alert, ScrollView, Text
} from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import { ContextoStates } from '../../lib/contextoStates';
import { obtenerCentrosAtencion } from '../../lib/servicios';
import Teja from '../../componentes/comunes/teja';
import setearCentros from './centroAtencionAcciones';

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#026F8E',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  texto: {
    color: '#FFF',
    fontSize: 19,
    paddingLeft: 10
  }
});

const ListaCentrosAtencion = ({ navigation }) => {
  const { loginState, centrosState, centrosDispatch } = useContext(ContextoStates);
  useEffect(() => {
    if (centrosState == null || centrosState.centros.length === 0) {
      obtenerCentrosAtencion(loginState.token)
        .then(res => res.json())
        .then(respuesta => {
          setearCentros(centrosDispatch, respuesta.response);
        })
        .catch(() => Alert.alert('Error durante la carga de centros.'));
    }
  }, []);

  const obtenerTurnoParaCentro = (idCentro) => loginState.turnosActivos
    .find(turno => turno.Center.id === idCentro);

  const seleccionarCentro = (centro) => {
    const turnoExistente = obtenerTurnoParaCentro(centro.id);
    if (turnoExistente) {
      navigation.navigate('Turno', { turno: turnoExistente });
    } else {
      navigation.navigate('CentroAtencion', { centro });
    }
  };

  if (centrosState == null) {
    return (
      <View style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <ScrollView>
        { centrosState.centros.map(centro => (
          <Teja
            key={centro.id}
            appIcon={centro.app_icon}
            manejadorClick={() => seleccionarCentro(centro)}
          >
            <Text style={estilos.texto}>{centro.name}</Text>
          </Teja>
        ))}
      </ScrollView>
    </View>
  );
};

export default withErrorBoundary('Error durante la carga del listadp de centros.', ListaCentrosAtencion);
