/* eslint-disable camelcase */
// @flow
import * as React from 'react';
import { useContext } from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView
} from 'react-native';
import { IconosCentros } from '../../lib/constantes';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';

const CentroContenedor = ({ route }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { centro } = route?.params;

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: estilosGlobales.colorFondoContenedorDatos,
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
      paddingBottom: 25,
    },
  });

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={estilos.contenedor}>
        <View style={estilos.subContenedor}>
          <Image style={estilosGlobales.imagenLogoCentro} source={IconosCentros[centro.app_icon]} />
          <Text style={{ ...estilosGlobales.subtituloGrande, ...{ paddingBottom: 25 } }}>
            {centro?.name}
          </Text>
          <Text style={[estilosGlobales.textoAviso, estilos.explicacion]}>
            Seleccione una categoría por favor.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default CentroContenedor;
