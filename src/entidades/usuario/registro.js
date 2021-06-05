// @flow
import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Alert, Keyboard, Animated, Dimensions,
} from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import TextoIngreso from '../../componentes/comunes/textoIngreso';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstados } from '../../lib/contextoEstados';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { ContextoIdiomas } from '../../lib/contextoIdioma';
import {
  validarExistenciaEmanil,
  validarExistenciaDNI,
  guardarUsuario,
  login,
} from '../../lib/servicios';
import { recuperarTokenFB, procesarMensajeError } from '../../lib/ayudante';
import LogoLogin from '../../componentes/comunes/svg/logoLogin';

const Registro = ({ navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { textosGlobales } = useContext(ContextoIdiomas);
  const [emailUsuario, cambioEmail] = useState('');
  const [contrasenaUsuario, cambioContrasena] = useState('');
  const [nombreUsuario, cambioNombre] = useState('');
  const [apellidoUsuario, cambioApellido] = useState('');
  const [dniUsuario, cambioDNI] = useState('');
  const [tokenUsuario, cambioToken] = useState('');
  const [emailExistente, setearEmailExistente] = useState(false);
  const [DNIExistente, setearDNIExistente] = useState(false);
  const [botonCargando, setearBotonCargando] = useState(false);
  const [mostrarValidaciones, cambiarMostrarValidaciones] = useState(false);
  const [fbtoken, setFbtoken] = useState('');
  const { fijarUsuarioLogueadoEnEstado } = useContext(ContextoEstados);
  const [tecladoVisible, cambioTecladoVisible] = useState(false);
  const [anchoContenedorLogo] = useState(new Animated.Value(0));
  const [medidaLogo] = useState(new Animated.Value(0));
  const [opacidadLogo] = useState(new Animated.Value(0.01));
  const topInicial = Math.round(Dimensions.get('window')?.height);
  const [posicionRegistroCompleto] = useState(new Animated.Value(topInicial));
  const [opacidadRegistroCompleto] = useState(new Animated.Value(0.01));

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => cambioTecladoVisible(true));
    Keyboard.addListener('keyboardDidHide', () => cambioTecladoVisible(false));

    return () => {
      Keyboard.removeListener('keyboardDidShow');
      Keyboard.removeListener('keyboardDidHide');
    };
  }, []);

  const estilos = StyleSheet.create({
    contenedorGlobal: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#E7E9EE',
    },
    contenedorRegistroCompleto: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      flexDirection: 'column',
      backgroundColor: '#8B6CC6',
    },
    contenedorLogo: {
      backgroundColor: estilosGlobales.colorFondoGlobal,
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      display: !tecladoVisible ? 'flex' : 'none',
    },
    fondoLogo: {
      position: 'absolute',
      top: !tecladoVisible ? 10 : -140,
      backgroundColor: estilosGlobales.colorFondoLogoLogin,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      zIndex: 2,
    },
    mensajeError: {
      color: '#696868',
    },
    contenedorCampos: {
      flexGrow: 3,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    subContenedorCampos: {
      flexGrow: 5,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '70%',
      marginTop: 20,
      marginBottom: 20,
    },
    subContenedorBotones: {
      flexGrow: 0.5,
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%'
    },
    subtituloGrande: {
      color: '#ffffff',
      fontSize: 20,
      textAlign: 'center',
      lineHeight: 25,
    },
    tituloSeccion: {
      color: '#ffffff',
      fontSize: 18,
      textAlign: 'center',
      lineHeight: 50,
    },
  });

  const animacionIngresoEncabezado = () => {
    Animated.timing(anchoContenedorLogo, {
      toValue: 90,
      duration: 700,
      useNativeDriver: false,
    }).start();
  };

  const animacionIngresoLogo = () => {
    Animated.timing(medidaLogo, {
      toValue: 100,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const animacionOpacidadLogo = () => {
    Animated.timing(opacidadLogo, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const animacionPosicionRegistroCompleto = () => {
    Animated.timing(posicionRegistroCompleto, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const animacionOpacidadRegistroCompleto = () => {
    Animated.timing(opacidadRegistroCompleto, {
      toValue: 1,
      duration: 700,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    setTimeout(() => {
      animacionIngresoEncabezado();
      setTimeout(() => {
        animacionIngresoLogo();
        setTimeout(() => {
          animacionOpacidadLogo();
        }, 200);
      }, 400);
    }, 400);
  }, []);

  const loguearUsuario = async () => {
    try {
      const firebaseToken = await recuperarTokenFB();
      setFbtoken(firebaseToken);
      const payload = { email: emailUsuario, password: contrasenaUsuario, fbtoken: firebaseToken };
      const res = await login(payload);
      const respuesta = await res.json();
      return respuesta;
    } catch (error) {
      Alert.alert(procesarMensajeError(error.message, 'Error durante el login.'));
    }
    return { success: false };
  };

  const enviarUsuario: Function = async (idFoto = '') => {
    try {
      const usuario = {
        dni: dniUsuario,
        name: nombreUsuario,
        surname: apellidoUsuario,
        email: emailUsuario,
        password: contrasenaUsuario,
        image: idFoto
      };

      const res = await guardarUsuario(usuario);
      const respuesta = await res.json();
      return respuesta;
    } catch (error) {
      Alert.alert(procesarMensajeError(error.message, 'Error mientras se creaba su usuario.'));
    }
    return { success: false };
  };

  const guardar = async () => {
    const respuesta = await enviarUsuario();
    if (respuesta.success) {
      const respuestaLogin = await loguearUsuario();
      if (respuestaLogin.success) {
        // Almacena temporalmente el token para notificar al usuario
        // y permitir que acepte comenzar a operar la app.
        cambioToken(respuestaLogin.token);
      } else {
        navigation.navigate('Login');
      }
    }
  };

  const validarDatosRegistro = async () => {
    cambiarMostrarValidaciones(true);
    if (
      !emailUsuario
      || !contrasenaUsuario
      || contrasenaUsuario?.trim().length < 8
      || contrasenaUsuario?.includes(' ')
      || !nombreUsuario
      || nombreUsuario?.trim().length < 3
      || !apellidoUsuario
      || apellidoUsuario?.trim().length < 3
      || !dniUsuario
    ) {
      return false;
    }

    let esValido = true;
    let res = await validarExistenciaEmanil(emailUsuario);
    let respuesta = await res.json();
    if (respuesta.success) {
      setearEmailExistente(!!respuesta.response);
      if (respuesta.response) {
        esValido = false;
      }
    }

    [res, respuesta] = [{}, {}];
    res = await validarExistenciaDNI(dniUsuario);
    respuesta = await res.json();
    if (respuesta.success) {
      setearDNIExistente(!!respuesta.response);
      if (respuesta.response) {
        esValido = false;
      }
    }

    return esValido;
  };

  const registrar = async () => {
    setearBotonCargando(true);
    const sonDatosValidos = await validarDatosRegistro();
    if (sonDatosValidos) {
      cambiarMostrarValidaciones(false);
      await guardar();
      animacionPosicionRegistroCompleto();
      setearBotonCargando(false);
      setTimeout(() => {
        animacionOpacidadRegistroCompleto();
      }, 1000);
    }
    setearBotonCargando(false);
  };

  const textoValidacion = texto => <Text style={estilos.mensajeError}>{texto}</Text>;
  const PantallaDatosPrincipales = (
    <View style={{ flex: 1 }}>
      <View style={estilos.contenedorCampos}>
        <View style={estilos.subContenedorCampos}>
          <TextoIngreso
            placeholderText={textosGlobales.registroEmail}
            value={emailUsuario}
            manejadorCambioTexto={cambioEmail}
            tipoDeTeclado="email-address"
            sinPrimeraLetraMayuscula
          />
          {!emailUsuario?.trim() && mostrarValidaciones
            && textoValidacion(textosGlobales.registroDatoRequerido)}
          {emailExistente && mostrarValidaciones
            && textoValidacion(textosGlobales.registroEmailYaRegistrado)}
          <TextoIngreso
            placeholderText={textosGlobales.registroContrasenia}
            value={contrasenaUsuario}
            manejadorCambioTexto={cambioContrasena}
            puedeEsconderTexto
            largoMaximo={16}
          />
          {!contrasenaUsuario?.trim() && mostrarValidaciones
            && textoValidacion(textosGlobales.registroDatoRequerido)}
          {contrasenaUsuario?.trim().length < 8 && mostrarValidaciones
            && textoValidacion(textosGlobales.registroMinimoOchoCaracteres)}
          {contrasenaUsuario?.includes(' ') && mostrarValidaciones && textoValidacion(textosGlobales.registroEmailYaRegistrado)}
          <TextoIngreso
            placeholderText={textosGlobales.registroNombre}
            value={nombreUsuario}
            manejadorCambioTexto={cambioNombre}
          />
          {!nombreUsuario?.trim() && mostrarValidaciones
            && textoValidacion(textosGlobales.registroDatoRequerido)}
          {nombreUsuario?.trim().length < 3 && mostrarValidaciones
            && textoValidacion(textosGlobales.registroMinimoTresCaracteres)}
          <TextoIngreso
            placeholderText={textosGlobales.registroApellido}
            value={apellidoUsuario}
            manejadorCambioTexto={cambioApellido}
          />
          {!apellidoUsuario?.trim() && mostrarValidaciones
            && textoValidacion(textosGlobales.registroDatoRequerido)}
          {apellidoUsuario?.trim().length < 3 && mostrarValidaciones
            && textoValidacion(textosGlobales.registroMinimoTresCaracteres)}
          <TextoIngreso
            placeholderText={textosGlobales.registroDni}
            value={dniUsuario}
            manejadorCambioTexto={cambioDNI}
            largoMaximo={8}
            tipoDeTeclado="numeric"
          />
          {!dniUsuario?.trim() && mostrarValidaciones
            && textoValidacion(textosGlobales.registroDatoRequerido)}
          {DNIExistente && mostrarValidaciones
            && textoValidacion(textosGlobales.registroDniYaRegistrado)}
        </View>
      </View>
      {!tecladoVisible && (
        <View style={estilos.subContenedorBotones}>
          <BotonRedondeado
            manejadorClick={registrar}
            cargando={botonCargando}
            estilo={{ marginTop: 20 }}
          >
            {textosGlobales.registroBotonRegistrarse}
          </BotonRedondeado>
        </View>
      )}
    </View>
  );

  const PantallaRegistroCompletado = (
    <Animated.View style={{ ...estilos.contenedorRegistroCompleto, top: posicionRegistroCompleto }}>
      <Animated.View style={{ ...estilos.contenedorCampos, opacity: opacidadRegistroCompleto }}>
        <Text style={estilos.subtituloGrande}>
          {textosGlobales.registroMensajeRegistroCompleto}
        </Text>
        <Text style={estilos.tituloSeccion}>{textosGlobales.registroMensajeEmpezarUso}</Text>
      </Animated.View>
      <Animated.View style={{ ...estilos.subContenedorBotones, opacity: opacidadRegistroCompleto }}>
        <BotonRedondeado
          // Almacena credenciales, esto cambia el navegador (Autenticado) y pasa a la Lobby.
          manejadorClick={() => fijarUsuarioLogueadoEnEstado(emailUsuario, tokenUsuario, fbtoken)}
          cargando={botonCargando}
          estilo={{ marginTop: 20 }}
        >
          {textosGlobales.registroBotonComenzar}
        </BotonRedondeado>
      </Animated.View>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={estilos.contenedorGlobal}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ ...estilos.contenedorLogo, height: anchoContenedorLogo }}>
          <Animated.View
            style={{ ...estilos.fondoLogo, ...{ width: medidaLogo, height: medidaLogo } }}
            elevation={5}
          >
            <Animated.View style={{ opacity: opacidadLogo }}>
              <LogoLogin width={100} height={100} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
        { PantallaDatosPrincipales }
      </ScrollView>
      { /* Solo visible luego de presionar Registrarme, la visibilidad se maneja con el efecto. */ }
      { PantallaRegistroCompletado }
    </View>
  );
};

export default withErrorBoundary('Error durante el registro.', Registro);
