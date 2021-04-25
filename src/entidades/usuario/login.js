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
      backgroundColor: estilosGlobales.colorFondoPantallaLogin,
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
    subContenedor: {
      flexGrow: !tecladoVisible ? 2 : 3.5,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '90%',
      paddingBottom: 20,
      borderRadius: 5,
    },
    botonera: {
      flexGrow: !tecladoVisible ? 1.5 : 0.5,
      backgroundColor: '#E7E9EE',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      paddingBottom: 10,
    },
    encabezadoBotonera: {
      flexGrow: 2,
      height: 60,
      backgroundColor: 'white',
      width: '90%',
      marginBottom: 20,
      borderRadius: 5,
      top: -15,
    },
    subBotonera: {
      flexGrow: !tecladoVisible ? 1 : 0.5,
      flexDirection: !tecladoVisible ? 'column' : 'row',
      alignItems: 'center',
      width: '90%',
      justifyContent: 'space-between',
    }
  });

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => { cambioTecladoVisible(true) });
    Keyboard.addListener('keyboardDidHide', () => { cambioTecladoVisible(false) });

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
        <View style={estilos.fondoLogo}>
          { IconosGenerales[NombresIconosGenerales.logoLogin] }
        </View>
        <View style={estilos.encabezado}></View>
        <View style={estilos.subContenedor}>
          <TextoIngreso
            placeholderText="e-mail"
            manejadorCambioTexto={cambioEmail}
            value={emailUsuario}
            soloLectura={cargando}
            manejadorClick={() => cambioLogin(false)}
            tipoDeTeclado="email-address"
            sinPrimeraLetraMayuscula
          />
          <TextoIngreso
            placeholderText="contraseña"
            manejadorCambioTexto={cambioContrasena}
            value={contrasenaUsuario}
            soloLectura={cargando}
            puedeEsconderTexto
            manejadorClick={() => cambioLogin(false)}
          />
          {loginIncorrecto
            && <Text style={estilosGlobales.mensajeError}>Usuario o contraseña incorrectos.</Text>}
        </View>
        <View style={estilos.botonera}>
          <View style={estilos.encabezadoBotonera}></View>
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
