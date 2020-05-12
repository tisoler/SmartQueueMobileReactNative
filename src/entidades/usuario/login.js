// @flow
import React, { useState, useContext } from 'react';
import {
  StyleSheet, View, Text, Image, Alert
} from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import TextoIngreso from '../../componentes/comunes/textoIngreso';
import { login } from '../../lib/servicios';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoStates } from '../../lib/contextoStates';
import { imagenLogo } from '../../lib/constantes';
import { setearUsuarioLogueado } from './usuarioAcciones';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0084a8',
    flexDirection: 'column',
    alignItems: 'center'
  },
  mensajeError: {
    color: '#910904',
    fontSize: 16,
    fontWeight: 'bold'
  },
  logo: {
    marginTop: 25,
    marginBottom: 30
  }
});

const Login = ({ navigation }) => {
  const [emailUsuario, cambioEmail] = useState('');
  const [passwordUsuario, cambioPassword] = useState('');
  const [cargando, cambioCargando] = useState(false);
  const [loginIncorrecto, cambioLogin] = useState(false);
  const { loginDispatch } = useContext(ContextoStates);

  const manejarLogin = () => {
    cambioLogin(false);
    cambioCargando(true);
    const payload = { email: emailUsuario, password: passwordUsuario };
    login(payload)
      .then(res => res.json())
      .then(response => {
        cambioCargando(false);
        if (response.success) {
          setearUsuarioLogueado(loginDispatch, payload.email, response.token);
          navigation.navigate('Lobby');
        } else {
          cambioLogin(true);
        }
      })
      .catch(() => Alert.alert('Error durante el login.'));
  };

  const registrarse = () => {
    navigation.navigate('Registro');
  };

  return (
    <View style={styles.container}>
      <Image source={imagenLogo} style={styles.logo} />
      <TextoIngreso
        PlaceholderText="Email"
        ManejadorCambioTexto={cambioEmail}
        Value={emailUsuario}
        SoloLectura={cargando}
        ManejadorClick={() => cambioLogin(false)}
      />
      <TextoIngreso
        PlaceholderText="Contraseña"
        ManejadorCambioTexto={cambioPassword}
        Value={passwordUsuario}
        SoloLectura={cargando}
        EsconderTexto
        ManejadorClick={() => cambioLogin(false)}
      />
      { loginIncorrecto
        && <Text style={styles.mensajeError}>Usuario o contraseña incorrectos.</Text>}
      <BotonRedondeado
        manejadorClick={manejarLogin}
        cargando={cargando}
      >
        INGRESAR
      </BotonRedondeado>
      { !cargando
        && (
          <BotonRedondeado
            manejadorClick={registrarse}
            colorBorde="#005f79"
            colorFondo="#005f79"
            colorEfecto="#fff"
          >
            REGISTRARSE
          </BotonRedondeado>
        )}
    </View>
  );
};

export default withErrorBoundary('Error durante la carga.', Login);
