// @flow
import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet, Animated,
} from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import { ContextoEstados } from '../../lib/contextoEstados';
import Estrella from '../../componentes/comunes/svg/estrella';
import { evaluarTurno } from '../../lib/servicios';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import Teja from '../../componentes/comunes/teja';

const EvaluacionTurno = () => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const {
    estadoLogin,
    estadoTurnosParaEvaluar,
    estadoIrEvaluacion,
    evaluarTurnoEnEstado,
    asignarEstadoIrEvaluacion
  } = useContext(ContextoEstados);
  const turnosParaEvaluar = estadoTurnosParaEvaluar;
  const turnoEvaluado = turnosParaEvaluar && turnosParaEvaluar.length > 0
    ? turnosParaEvaluar[0]
    : null;
  const [cantidadEstrellas, setCantidadEstrellas] = useState(0);
  const [altoContenedorEstrellas] = useState(new Animated.Value(0));

  const animacionIngresoEstrellas = () => {
    Animated.timing(altoContenedorEstrellas, {
      toValue: 250,
      duration: 700,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const intervaloId = setTimeout(() => {
      animacionIngresoEstrellas();
    }, 400);

    return () => clearTimeout(intervaloId);
  }, []);

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: '#ffffff',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between',
    },
    contenedorTurno: {
      backgroundColor: estilosGlobales.colorFondoGlobal,
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingBottom: 30,
      paddingTop: 30,
    },
    contenedorHijos: {
      flex: 2,
      flexDirection: 'column',
    },
    centro: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: 19,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingLeft: 4,
      paddingRight: 4,
    },
    categoria: {
      color: estilosGlobales.colorTextoGeneral,
      fontSize: 17,
      textAlign: 'center',
    },
    contenedorEstrellas: {
      backgroundColor: '#8B6CC6',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '95%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      paddingTop: 30,
    },
    texto: {
      position: 'absolute',
      top: 210,
      fontSize: 19,
      color: '#8A8A8A',
      marginTop: 5,
      textAlign: 'center',
      paddingRight: 30,
      paddingLeft: 30,
      lineHeight: 25,
    }
  });

  if (!turnoEvaluado) {
    return (
      <View style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  const evaluar = (cantEstrellas) => {
    if (cantidadEstrellas === 0) {
      setCantidadEstrellas(cantEstrellas);
      evaluarTurno(estadoLogin.token, turnoEvaluado.Center.id, cantEstrellas)
        .then(respuesta => respuesta.json())
        .then(respuesta => {
          if (respuesta.success) {
            setTimeout(() => {
              if (turnosParaEvaluar.length > 1) {
                setCantidadEstrellas(0);
              } else if (estadoIrEvaluacion) {
                // Cuando llama desde notificación usa este state
                // Una vez que se evalúan los turnos lo pasa a false
                asignarEstadoIrEvaluacion(false);
              }
              evaluarTurnoEnEstado(turnoEvaluado);
            }, 1500);
          }
        });
    }
  };

  const TicketTurno = () => (
    <View style={estilos.contenedorTurno}>
      <Teja
        key={turnoEvaluado.id}
        appIcon={turnoEvaluado.Center.app_icon}
        height={120}
        width={300}
      >
        <View style={estilos.contenedorHijos}>
          <Text style={estilos.centro}>{turnoEvaluado.Center.name}</Text>
          <Text style={estilos.categoria}>{turnoEvaluado.Category.name}</Text>
        </View>
      </Teja>
    </View>
  );

  return (
    <View style={estilos.contenedor}>
      <TicketTurno />
      <Text style={[estilos.texto]}>
        { cantidadEstrellas === 0
          ? 'Por favor evalúe nuestra atención. Nos permite mejorar el servicio.'
          : 'Muchas gracias, que tenga un buen día.'}
      </Text>
      <Animated.View
        style={{ ...estilos.contenedorEstrellas, height: altoContenedorEstrellas }}
        elevation={5}
      >
        <Estrella rellenar={cantidadEstrellas >= 1} ManejadorClick={() => evaluar(1)} />
        <Estrella rellenar={cantidadEstrellas >= 2} ManejadorClick={() => evaluar(2)} />
        <Estrella rellenar={cantidadEstrellas >= 3} ManejadorClick={() => evaluar(3)} />
        <Estrella rellenar={cantidadEstrellas >= 4} ManejadorClick={() => evaluar(4)} />
        <Estrella rellenar={cantidadEstrellas >= 5} ManejadorClick={() => evaluar(5)} />
      </Animated.View>
    </View>
  );
};

export default withErrorBoundary('Error durante la evaluación del turno.', EvaluacionTurno);
