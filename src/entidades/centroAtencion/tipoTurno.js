// @flow
import * as React from 'react';
import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoIdiomas } from '../../lib/contextoIdioma';

const TipoTurno = (props) => {
  const {
    pedirTurnoFila,
    pedirTurnoAgendado,
  } = props;
  const { textosGlobales } = useContext(ContextoIdiomas);

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
        {textosGlobales.tipoTurnoTurnosFila}
      </BotonRedondeado>
      <BotonRedondeado
        manejadorClick={() => pedirTurnoAgendado()}
        colorFondo="#8B6CC6"
        colorBorde="#8B6CC6"
        estilo={{ marginTop: 22 }}
        flechaAlFinal
      >
        {textosGlobales.tipoTurnoTurnosAgendados}
      </BotonRedondeado>
    </View>
  );
};

export default withErrorBoundary('Error en tipo de turno.', withDialogoEmergente(TipoTurno));
