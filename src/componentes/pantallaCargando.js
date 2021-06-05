// @flow
import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ContextoEstilosGlobales } from '../lib/contextoEstilosGlobales';
import { ContextoIdiomas } from '../lib/contextoIdioma';


export default () => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { textosGlobales } = useContext(ContextoIdiomas);
  const estilos = StyleSheet.create({
    contenedor: {
      flexGrow: 1,
      backgroundColor: estilosGlobales.colorFondoGlobal,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

  return (
    <View style={estilos.contenedor}>
      <Text style={estilosGlobales.subtituloGrande}>{textosGlobales.saludoInicial}</Text>
      <Text style={estilosGlobales.tituloSeccionClaro}>
        {textosGlobales.mensajeRecuperandoDatos}
      </Text>
    </View>
  );
};
