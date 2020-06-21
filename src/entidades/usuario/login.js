// @flow
import React, { useState, useContext } from 'react';
import {
  StyleSheet, View, Text, Image, Alert, ScrollView
} from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import TextoIngreso from '../../componentes/comunes/textoIngreso';
import { login } from '../../lib/servicios';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstados } from '../../lib/contextoEstados';
import { ImagenLogo, NombresIconosGenerales, mensajes } from '../../lib/constantes';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { recuperarTokenFB, recuperarDatosLocalmente, procesarMensajeError } from '../../lib/ayudante';


const Login = ({ navigation }) => {
  const { estadoLogin, fijarUsuarioLogueadoEnEstado } = useContext(ContextoEstados);
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const [emailUsuario, cambioEmail] = useState(estadoLogin?.email || '');
  const [contrasenaUsuario, cambioContrasena] = useState('');
  const [cargando, cambioCargando] = useState(false);
  const [loginIncorrecto, cambioLogin] = useState(false);

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

  const loguear = async () => {
    cambioLogin(false);
    cambioCargando(true);
    const fbtoken = await recuperarTokenFB();
    const temaUsuario = await recuperarDatosLocalmente('@temaUsuario');
    const payload = { email: emailUsuario, password: contrasenaUsuario, fbtoken };
    login(payload)
      .then(res => res.json())
      .then(respuesta => {
        cambioCargando(false);
        if (respuesta?.success) {
          fijarUsuarioLogueadoEnEstado(emailUsuario, respuesta.token, fbtoken, temaUsuario || '');
        } else {
          // eslint-disable-next-line no-lonely-if
          if (respuesta?.message?.trim().toLowerCase().includes('connect econnrefused')) {
            Alert.alert(mensajes.sinServicio);
          } else {
            cambioLogin(true);
          }
        }
      })
      .catch(error => {
        Alert.alert(procesarMensajeError(error.message, 'Error durante el login.'));
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
          <Image source={ImagenLogo} style={estilos.logo} />
          <TextoIngreso
            placeholderText="e-mail"
            manejadorCambioTexto={cambioEmail}
            value={emailUsuario}
            soloLectura={cargando}
            manejadorClick={() => cambioLogin(false)}
            icono={NombresIconosGenerales.correo}
            tipoDeTeclado="email-address"
            sinPrimeraLetraMayuscula
          />
          <TextoIngreso
            placeholderText="Contraseña"
            manejadorCambioTexto={cambioContrasena}
            value={contrasenaUsuario}
            soloLectura={cargando}
            puedeEsconderTexto
            manejadorClick={() => cambioLogin(false)}
            icono={NombresIconosGenerales.contrasena}
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
