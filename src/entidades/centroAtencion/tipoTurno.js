// @flow
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';

const TipoTurno = (props) => {
  const {
    pedirTurnoFila,
    pedirTurnoAgendado,
  } = props;

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={estilos.contenedor}>
      <BotonRedondeado
        manejadorClick={() => pedirTurnoFila()}
        flechaAlFinal
      >
        Fila virtual
      </BotonRedondeado>
      <BotonRedondeado
        manejadorClick={() => pedirTurnoAgendado()}
        colorFondo="#8B6CC6"
        colorBorde="#8B6CC6"
        estilo={{ marginTop: 22 }}
        flechaAlFinal
      >
        Turno agendado
      </BotonRedondeado>
    </View>
  );
};

export default withErrorBoundary('Error en tipo de turno.', withDialogoEmergente(TipoTurno));
