// @flow
import React, { useContext, useEffect } from 'react';
import {
  View, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import { ContextoStates } from '../../lib/contextoStates';
import { obtenerCentrosAtencion } from '../../lib/servicios';
import ImagenLink from '../../componentes/comunes/imagenLink';

const estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0084a8',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }
});

const ListaCentrosAtencion = ({ navigation }) => {
  const { loginState, centrosState, centrosDispatch } = useContext(ContextoStates);
  useEffect(() => {
    if (centrosState == null || centrosState.centros.length === 0) {
      obtenerCentrosAtencion(loginState.token)
        .then(res => res.json())
        .then(response => {
          centrosDispatch({
            type: 'SET_CENTROS',
            payload: { centros: response.response }
          });
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
      <View style={estilo.container}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={estilo.container}>
      { centrosState.centros.map(centro => (
        <ImagenLink
          key={centro.id}
          AppIcon={centro.app_icon}
          ManejadorClick={() => seleccionarCentro(centro)}
          Texto={centro.name}
        />
      ))}
    </View>
  );
};

export default withErrorBoundary('Error durante la carga del listadp de centros.', ListaCentrosAtencion);
