// @flow
import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet, View, Text, Alert, ScrollView, Keyboard
} from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import TextoIngreso from '../../componentes/comunes/textoIngreso';
import { login } from '../../lib/servicios';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstados } from '../../lib/contextoEstados';
import { NombresIconosGenerales, mensajes } from '../../lib/constantes';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { recuperarTokenFB, recuperarDatosLocalmente, procesarMensajeError } from '../../lib/ayudante';
import IconosGenerales from '../../lib/iconos';

const Login = ({ navigation }) => {
  const { estadoLogin, fijarUsuarioLogueadoEnEstado } = useContext(ContextoEstados);
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const [emailUsuario, cambioEmail] = useState(estadoLogin?.email || '');
  const [contrasenaUsuario, cambioContrasena] = useState('');
  const [cargando, cambioCargando] = useState(false);
  const [loginIncorrecto, cambioLogin] = useState(false);
  const [tecladoVisible, cambioTecladoVisible] = useState(false);

  const estilos = StyleSheet.create({
    contenedor: {
      flexGrow: 1,
      backgroundColor: estilosGlobales.colorFondoGlobal,
      flexDirection: 'column',
      alignItems: 'center',
    },
    fondoLogo: {
      position: 'absolute',
      top: !tecladoVisible ? 10 : -140,
      backgroundColor: estilosGlobales.colorFondoLogoLogin,
      alignItems: 'center',
      justifyContent: 'center',
      height: 140,
      width: 140,
      borderRadius: 100,
      zIndex: 2,
    },
    encabezado: {
      height: !tecladoVisible ? 90 : 0,
      backgroundColor: '#6875E1',
    },
    sombra: {
      elevation: 5,
    },
    subContenedor: {
      flexGrow: !tecladoVisible ? 2 : 3.5,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '85%',
      paddingBottom: 20,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      zIndex: 1,
    },
    camposLoguin: {
      width: '95%',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 125,
    },
    botonera: {
      flexGrow: 1.5,
      backgroundColor: '#E7E9EE',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      paddingBottom: 10,
    },
    encabezadoBotonera: {
      flexGrow: 2,
      height: 40,
      backgroundColor: 'white',
      width: '85%',
      marginBottom: 20,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      top: -5,
    },
    subBotonera: {
      display: !tecladoVisible ? 'flex' : 'none',
      flexGrow: 1,
      flexDirection: 'column',
      alignItems: 'center',
      width: '90%',
      justifyContent: 'space-between',
    }
  });

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => cambioTecladoVisible(true));
    Keyboard.addListener('keyboardDidHide', () => cambioTecladoVisible(false));

    return () => {
      Keyboard.removeListener('keyboardDidShow');
      Keyboard.removeListener('keyboardDidHide');
    };
  }, []);

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

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={estilos.contenedor}>
        <View style={estilos.fondoLogo} elevation={5}>
          { IconosGenerales[NombresIconosGenerales.logoLogin] }
        </View>
        <View style={estilos.encabezado} />
        <View style={estilos.subContenedor}>
          <View style={estilos.camposLoguin}>
            <TextoIngreso
              placeholderText="Email"
              manejadorCambioTexto={cambioEmail}
              value={emailUsuario}
              soloLectura={cargando}
              manejadorClick={() => cambioLogin(false)}
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
            />
          </View>
          {loginIncorrecto
            && <Text style={estilosGlobales.mensajeError}>Usuario o contraseña incorrectos.</Text>}
        </View>
        <View style={estilos.botonera}>
          <View style={estilos.encabezadoBotonera} elevation={6} />
          <View style={estilos.subBotonera}>
            <BotonRedondeado
              manejadorClick={loguear}
              cargando={cargando}
              deshabilitado={cargando}
              width={tecladoVisible ? '47%' : '100%'}
              height={tecladoVisible ? 45 : 59}
            >
              Ingresar
            </BotonRedondeado>
            {!cargando
              && (
                <BotonRedondeado
                  manejadorClick={() => navigation.navigate('Registro')}
                  colorBorde={estilosGlobales.colorEfectoClickBotonSecundario}
                  colorFondo={estilosGlobales.colorFondoBotonSecundario}
                  colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
                  deshabilitado={cargando}
                  width={tecladoVisible ? '47%' : '100%'}
                  height={tecladoVisible ? 45 : 59}
                  colorTexto={estilosGlobales.colorFondoBotonPrincipal}
                >
                  Registrarse
                </BotonRedondeado>
              )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default withErrorBoundary('Error durante la carga.', Login);
