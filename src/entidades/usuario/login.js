// @flow
import React, { useState, useContext } from 'react';
import {
  StyleSheet, View, Text, Image, Alert, ScrollView
} from 'react-native';
import { faIdCard, faKey } from '@fortawesome/free-solid-svg-icons';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import TextoIngreso from '../../componentes/comunes/textoIngreso';
import { login } from '../../lib/servicios';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoStates } from '../../lib/contextoStates';
import { imagenLogo } from '../../lib/constantes';
import { setearUsuarioLogueado } from './usuarioAcciones';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';

const Login = ({ navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const [emailUsuario, cambioEmail] = useState('');
  const [contrasenaUsuario, cambioContrasena] = useState('');
  const [cargando, cambioCargando] = useState(false);
  const [loginIncorrecto, cambioLogin] = useState(false);
  const { loginDispatch } = useContext(ContextoStates);

  const estilos = StyleSheet.create({
    contenedor: {
      flexGrow: 1,
      backgroundColor: estilosGlobales.colorFondoPantallaLogin,
      flexDirection: 'column',
      alignItems: 'center'
    },
    subContenedor: {
      flexGrow: 1,
      alignItems: 'center',
      width: '100%'
    },
    logo: {
      marginTop: 25,
      marginBottom: 30
    },
    botonera: {
      flexGrow: 4,
      alignItems: 'center',
      width: '100%',
    }
  });

  const loguear = () => {
    cambioLogin(false);
    cambioCargando(true);
    const payload = { email: emailUsuario, password: contrasenaUsuario };
    login(payload)
      .then(res => res.json())
      .then(respuesta => {
        cambioCargando(false);
        if (respuesta.success) {
          setearUsuarioLogueado(loginDispatch, emailUsuario, respuesta.token, contrasenaUsuario);
        } else {
          cambioLogin(true);
        }
      })
      .catch(error => {
        Alert.alert(error.message);
        cambioCargando(false);
      });
  };

  const registrarse = () => {
    cambioCargando(true);
    navigation.navigate('Registro');
    cambioCargando(false);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={estilos.contenedor}>
        <View style={estilos.subContenedor}>
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
          {loginIncorrecto
            && <Text style={estilosGlobales.mensajeError}>Usuario o contraseña incorrectos.</Text>}
        </View>
        <View style={estilos.botonera}>
          <BotonRedondeado
            manejadorClick={loguear}
            cargando={cargando}
            deshabilitado={cargando}
          >
            INGRESAR
          </BotonRedondeado>
          {!cargando
            && (
              <BotonRedondeado
                manejadorClick={registrarse}
                colorBorde={estilosGlobales.colorBordeBotonSecundario}
                colorFondo={estilosGlobales.colorFondoBotonSecundario}
                colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
                estilo={{ marginTop: 22 }}
                deshabilitado={cargando}
              >
                REGISTRARSE
              </BotonRedondeado>
            )}
        </View>
      </View>
    </ScrollView>
  );
};

export default withErrorBoundary('Error durante la carga.', Login);
