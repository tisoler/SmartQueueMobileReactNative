// @flow
import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ContextoEstilosGlobales } from '../lib/contextoEstilosGlobales';


export default () => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
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
      <Text style={estilosGlobales.subtituloGrande}>Hola</Text>
      <Text style={estilosGlobales.tituloSeccion}>Estoy recuperando tus datos...</Text>
    </View>
  );
};
