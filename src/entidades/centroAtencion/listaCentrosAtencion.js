// @flow
import React, { useContext, useEffect } from 'react';
import {
  View, StyleSheet, ActivityIndicator, Alert, ScrollView, TextInput
} from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import { ContextoEstados } from '../../lib/contextoEstados';
import { obtenerCentrosAtencion } from '../../lib/servicios';
import Teja from '../../componentes/comunes/teja';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { procesarMensajeError, esTokenValido } from '../../lib/ayudante';

const ListaCentrosAtencion = ({ navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const {
    estadoLogin,
    estadoCentros,
    estadoTurnosActivos,
    estadoFbToken,
    estadoTemaUsuario,
    fijarCentrosEnEstado,
    fijarUsuarioLogueadoEnEstado,
    fijarTurnoActualEnEstado
  } = useContext(ContextoEstados);
  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: estilosGlobales.colorFondoContenedorDatos,
      flexDirection: 'column',
      justifyContent: 'center'
    },
    texto: {
      color: '#FFF',
      fontSize: 19,
      paddingLeft: 10,
      width: estilosGlobales.anchoEtiquetaTeja
    }
  });

  useEffect(() => {
    if (estadoCentros == null || estadoCentros.centros.length === 0) {
      obtenerCentrosAtencion(estadoLogin.token)
        .then(res => res.json())
        .then(respuesta => {
          fijarCentrosEnEstado(respuesta.response);
        })
        .catch((error) => {
          if (esTokenValido(
            error?.message,
            fijarUsuarioLogueadoEnEstado,
            estadoLogin.email,
            estadoFbToken,
            estadoTemaUsuario
          )) {
            Alert.alert(procesarMensajeError(error.message, 'Error durante la carga de centros.'));
          }
        });
    }
  }, []);

  const obtenerTurnoParaCentro = (idCentro) => estadoTurnosActivos
    .find(turno => turno.Center.id === idCentro);

  const seleccionarCentro = (centro) => {
    const turnoExistente = obtenerTurnoParaCentro(centro.id);
    if (turnoExistente) {
      fijarTurnoActualEnEstado(turnoExistente, null);
      navigation.navigate('Turno', { turno: turnoExistente });
    } else {
      navigation.navigate('CentroAtencion', { centro });
    }
  };

  if (!estadoCentros) {
    return (
      <View style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <ScrollView showsVerticalScrollIndicator={false}>
        { estadoCentros.centros.map(centro => (
          <Teja
            key={centro.id}
            appIcon={centro.app_icon}
            manejadorClick={() => seleccionarCentro(centro)}
          >
            <TextInput multiline editable={false} style={estilos.texto}>{centro.name}</TextInput>
          </Teja>
        ))}
      </ScrollView>
    </View>
  );
};

export default withErrorBoundary('Error durante la carga del listadp de centros.', withDialogoEmergente(ListaCentrosAtencion));
