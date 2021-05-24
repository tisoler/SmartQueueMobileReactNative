// @flow
import * as React from 'react';
import { useContext } from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView
} from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import { ContextoEstados } from '../../lib/contextoEstados';
import { IconosCentros } from '../../lib/constantes';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';

const TipoTurno = ({ route, navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { centro, turnoExistente, turnoAgendadoExistente } = route?.params;
  const { fijarTurnoActualEnEstado } = useContext(ContextoEstados);

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: '#ffffff',
      flexDirection: 'column',
      alignItems: 'center'
    },
    subContenedor: {
      backgroundColor: estilosGlobales.colorFondoGlobal,
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    explicacion: {
      paddingTop: 25,
      paddingBottom: 25,
    },
  });

  const pedirTurno = () => {
    if (turnoExistente) {
      fijarTurnoActualEnEstado(turnoExistente, null);
      navigation.navigate('Turno');
    } else {
      navigation.navigate('CentroAtencion', { centro });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={estilos.contenedor}>
        <View style={estilos.subContenedor}>
          <Image style={estilosGlobales.imagenLogoCentro} source={IconosCentros[centro.app_icon]} />
          <Text style={estilosGlobales.subtituloGrande}>{centro?.name}</Text>
          <Text style={[estilosGlobales.textoAviso, estilos.explicacion]}>
            ¿Qué tipo de turno desea solicitar?
          </Text>
        </View>
        {!turnoExistente && (
          <BotonRedondeado
            manejadorClick={() => pedirTurno()}
            estilo={{ marginTop: 42 }}
            flechaAlFinal
          >
            Fila virtual
          </BotonRedondeado>
        )}
        {!turnoAgendadoExistente && (
          <BotonRedondeado
            manejadorClick={() => navigation.navigate('Calendario')}
            colorFondo="#8B6CC6"
            colorBorde="#8B6CC6"
            estilo={{ marginTop: 22 }}
            flechaAlFinal
          >
            Turno agendado
          </BotonRedondeado>
        )}
      </View>
    </ScrollView>
  );
};

export default withErrorBoundary('Error en tipo de turno.', withDialogoEmergente(TipoTurno));
