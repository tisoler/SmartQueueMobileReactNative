// @flow
import React, { useContext, useState } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet, Image
} from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import { ContextoStates } from '../../lib/contextoStates';
import Estrella from '../../componentes/comunes/svg/estrella';
import { iconosCentros } from '../../lib/constantes';
import { evaluarTurno } from '../../lib/servicios';
import { evaluarTurnoState } from '../usuario/usuarioAcciones';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';

const EvaluacionTurno = ({ navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { loginState, loginDispatch } = useContext(ContextoStates);
  const { turnosParaEvaluar } = loginState;
  const turnoEvaluado = turnosParaEvaluar[0];
  const [cantidadEstrellas, setCantidadEstrellas] = useState(0);
  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: estilosGlobales.colorFondoContenedorDatos,
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      paddingRight: 20,
      paddingLeft: 20
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
    margen: {
      marginTop: 30
    },
    contenedorEstrellas: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 30
    },
    texto: {
      fontSize: 22,
      color: '#fff',
      marginTop: 5,
      textAlign: 'center'
    }
  });

  const evaluar = (cantEstrellas) => {
    setCantidadEstrellas(cantEstrellas);
    evaluarTurno(loginState.token, turnoEvaluado.Center.id, cantEstrellas)
      .then(respuesta => respuesta.json())
      .then(respuesta => {
        if (respuesta.success) {
          evaluarTurnoState(loginDispatch, turnoEvaluado);
          if (turnosParaEvaluar.length === 1) {
            setTimeout(() => {
              navigation.navigate('Lobby');
            }, 500);
          } else {
            setCantidadEstrellas(0);
          }
        }
      });
  };

  if (!turnoEvaluado) {
    return (
      <View style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Image style={estilosGlobales.imagenLogoCentro} source={iconosCentros[turnoEvaluado.Center.app_icon]} />
      <Text style={estilos.titulo}>{turnoEvaluado.code}</Text>
      <Text style={estilos.subtitulo}>
        {turnoEvaluado.Category.name}
      </Text>
      <Text style={[estilos.texto, estilos.margen]}>
        { cantidadEstrellas === 0
          ? '¿Por favor evalúe nuestra atención? Nos permite mejorar el servicio.'
          : 'Muchas gracias, que tenga un buen día.'}
      </Text>
      <View style={estilos.contenedorEstrellas}>
        <Estrella rellenar={cantidadEstrellas >= 1} ManejadorClick={() => evaluar(1)} />
        <Estrella rellenar={cantidadEstrellas >= 2} ManejadorClick={() => evaluar(2)} />
        <Estrella rellenar={cantidadEstrellas >= 3} ManejadorClick={() => evaluar(3)} />
        <Estrella rellenar={cantidadEstrellas >= 4} ManejadorClick={() => evaluar(4)} />
        <Estrella rellenar={cantidadEstrellas >= 5} ManejadorClick={() => evaluar(5)} />
      </View>
    </View>
  );
};

export default withErrorBoundary('Error durante la evaluación del turno.', EvaluacionTurno);
