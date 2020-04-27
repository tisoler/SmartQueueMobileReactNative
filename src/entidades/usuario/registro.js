// @flow
import React from 'react';
import { StyleSheet, View } from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import TextoIngreso from '../../componentes/comunes/textoIngreso';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0084a8',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const Registro = () => (
  <View style={styles.container}>
    <TextoIngreso
      PlaceholderText="Email"
      ManejadorCambioTexto={null}
      Value=""
      SoloLectura={false}
    />
    <TextoIngreso
      PlaceholderText="Contraseña"
      ManejadorCambioTexto={null}
      Value=""
      SoloLectura={false}
    />
    <BotonRedondeado
      ManejadorClick={null}
      Cargando={false}
      Color="#fff"
    >
      REGISTRARSE
    </BotonRedondeado>
  </View>
);

export default withErrorBoundary('Error durante el registro.', Registro);
