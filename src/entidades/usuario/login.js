// @flow
import React, { useState, useContext } from 'react';
import {
  StyleSheet, View, Text, Image, Alert
} from 'react-native';
import { faIdCard, faKey } from '@fortawesome/free-solid-svg-icons';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import TextoIngreso from '../../componentes/comunes/textoIngreso';
import { login } from '../../lib/servicios';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoStates } from '../../lib/contextoStates';
import { imagenLogo } from '../../lib/constantes';
import { setearUsuarioLogueado } from './usuarioAcciones';

const estilos = StyleSheet.create({
  contenedor: {
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
  },
  botonera: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  }
});

const Login = ({ navigation }) => {
  const [emailUsuario, cambioEmail] = useState('');
  const [contrasenaUsuario, cambioContrasena] = useState('');
  const [cargando, cambioCargando] = useState(false);
  const [loginIncorrecto, cambioLogin] = useState(false);
  const { loginDispatch } = useContext(ContextoStates);

  const manejarLogin = () => {
    cambioLogin(false);
    cambioCargando(true);
    const payload = { email: emailUsuario, password: contrasenaUsuario };
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
    <View style={estilos.contenedor}>
      <Image source={imagenLogo} style={estilos.logo} />
      <TextoIngreso
        placeholderText="e-mail"
        manejadorCambioTexto={cambioEmail}
        value={emailUsuario}
        soloLectura={cargando}
        manejadorClick={() => cambioLogin(false)}
        icono={faIdCard}
      />
      <TextoIngreso
        placeholderText="Contraseña"
        manejadorCambioTexto={cambioContrasena}
        value={contrasenaUsuario}
        soloLectura={cargando}
        esconderTexto
        manejadorClick={() => cambioLogin(false)}
        icono={faKey}
      />
      { loginIncorrecto
        && <Text style={estilos.mensajeError}>Usuario o contraseña incorrectos.</Text>}
      <View style={estilos.botonera}>
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
    </View>
  );
};

export default withErrorBoundary('Error durante la carga.', Login);
