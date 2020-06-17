// @flow
import React, { useState, useContext } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Image, Alert
} from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import TextoIngreso from '../../componentes/comunes/textoIngreso';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import Etiqueta from '../../componentes/comunes/etiqueta';
// V2 import Camara from '../../componentes/comunes/camara';
import { ContextoEstados } from '../../lib/contextoEstados';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import {
  validarExistenciaEmanil,
  validarExistenciaDNI,
  // guardarAvatar,
  guardarUsuario,
  login,
} from '../../lib/servicios';
import { NombresIconosGenerales } from '../../lib/constantes';
import { recuperarTokenFB, recuperarMensajeError } from '../../lib/ayudante';

const Registro = ({ navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const [numeroPantalla, cambioPantalla] = useState(1);
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
  // V2 const [uriFoto, guardarUriFoto] = useState();
  const [uriFoto] = useState();
  const [fbtoken, setFbtoken] = useState('');
  const { fijarUsuarioLogueadoEnEstado } = useContext(ContextoEstados);

  const estilos = StyleSheet.create({
    contenedorGlobal: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: estilosGlobales.colorFondoGlobal
    },
    contenedorCampos: {
      flexGrow: 2,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    encabezadoDatosUsuario: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: estilosGlobales.colorFondoEncabezadoTitulos
    },
    subContenedorCampos: {
      flexGrow: 5,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: estilosGlobales.colorFondoContenedorDatos
    },
    subContenedorMensajeFoto: {
      flexGrow: 1.2,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: 20,
      backgroundColor: estilosGlobales.colorFondoContenedorDatos
    },
    subContenedorBotones: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%'
    },
    encabezadoPantallaConfirmar: {
      flexDirection: 'row',
      height: 130,
      width: '100%',
      backgroundColor: estilosGlobales.colorFondoEncabezadoTitulos,
      alignItems: 'center',
      paddingLeft: 5
    },
    contenedorDatosConfirmar: {
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      paddingLeft: 7,
      paddingTop: 30,
      paddingBottom: 30,
      backgroundColor: estilosGlobales.colorFondoContenedorDatos
    },
    contenedorFotografia: {
      position: 'absolute',
      width: 130,
      height: 130,
      right: 10,
      paddingTop: 5,
      paddingBottom: 5
    },
    contenedorAvatar: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      height: 110,
      width: 110,
      borderRadius: 100,
      backgroundColor: estilosGlobales.colorAvatarLetra,
      paddingBottom: 4,
      right: 10
    },
    letraAvatar: {
      fontSize: 50,
      color: estilosGlobales.colorLetraEncabezado,
      textAlign: 'center'
    }
  });

  const textoValidacion = texto => <Text style={estilosGlobales.mensajeError}>{texto}</Text>;
  const pantallaDatosPrincipales = (
    <View style={estilos.contenedorCampos}>
      <View style={estilos.encabezadoDatosUsuario}>
        <Text style={estilosGlobales.tituloSeccion}>
          Mis datos:
        </Text>
      </View>
      <View style={estilos.subContenedorCampos}>
        <TextoIngreso
          placeholderText="e-mail"
          value={emailUsuario}
          icono={NombresIconosGenerales.correo}
          manejadorCambioTexto={cambioEmail}
          tipoDeTeclado="email-address"
          sinPrimeraLetraMayuscula
        />
        {!emailUsuario?.trim() && mostrarValidaciones && textoValidacion('Dato requerido.')}
        {emailExistente && mostrarValidaciones && textoValidacion('El email ingresado ya está registrado.')}
        <TextoIngreso
          placeholderText="Contraseña"
          value={contrasenaUsuario}
          icono={NombresIconosGenerales.contrasena}
          manejadorCambioTexto={cambioContrasena}
          puedeEsconderTexto
          largoMaximo={16}
        />
        {!contrasenaUsuario?.trim() && mostrarValidaciones && textoValidacion('Dato requerido.')}
        {contrasenaUsuario?.trim().length < 8 && textoValidacion('Debe tener 8 caracteres al menos.')}
        {contrasenaUsuario?.includes(' ') && mostrarValidaciones && textoValidacion('No puede tener espacios en blanco.')}
        <TextoIngreso
          placeholderText="Nombre"
          value={nombreUsuario}
          icono={NombresIconosGenerales.usuario}
          manejadorCambioTexto={cambioNombre}
        />
        {!nombreUsuario?.trim() && mostrarValidaciones && textoValidacion('Dato requerido.')}
        <TextoIngreso
          placeholderText="Apellido"
          value={apellidoUsuario}
          icono={NombresIconosGenerales.usuario}
          manejadorCambioTexto={cambioApellido}
        />
        {!apellidoUsuario?.trim() && mostrarValidaciones && textoValidacion('Dato requerido.')}
        <TextoIngreso
          placeholderText="DNI"
          value={dniUsuario}
          icono={NombresIconosGenerales.dni}
          manejadorCambioTexto={cambioDNI}
          largoMaximo={8}
          tipoDeTeclado="numeric"
        />
        {!dniUsuario?.trim() && mostrarValidaciones && textoValidacion('Dato requerido.')}
        {DNIExistente && mostrarValidaciones && textoValidacion('El DNI ingresado ya está registrado.')}
      </View>
    </View>
  );

  /* Recuperar para V2
  const pantallaSolicitarFotografia = (
    <View style={estilos.subContenedorMensajeFoto}>
      <Text style={estilosGlobales.textoAviso}>
        Es necesario que se tome una foto a fin de ser reconocida/o al momento de ser atendida/o.
      </Text>
    </View>
  );

  const aceptarFoto = () => {
    cambioPantalla(numeroPantalla + 1);
  };

  const pantallaCamara = (
    <Camara
      guardarUriFoto={guardarUriFoto}
      uriFoto={uriFoto}
      aceptarFoto={aceptarFoto}
    />
  );
  Fin recuperar para V2 */

  const iniciales = (`${nombreUsuario?.charAt(0) || '?'}${apellidoUsuario?.charAt(0) || '?'}`).toUpperCase();
  const pantallaConfirmarDatos = (
    <View style={estilos.contenedorCampos}>
      <View style={estilos.encabezadoPantallaConfirmar}>
        <View style={{ width: '60%' }}>
          <Etiqueta multilinea value={`${nombreUsuario} ${apellidoUsuario}`} icono={NombresIconosGenerales.usuario} />
        </View>
        {uriFoto ? (
          <View style={estilos.contenedorFotografia}>
            <Image
              source={{ uri: uriFoto, isStatic: true }}
              style={{ width: '100%', height: '100%', borderRadius: 100 }}
            />
          </View>
        ) : (
          <View style={estilos.contenedorAvatar}>
            <Text style={estilos.letraAvatar}>{iniciales}</Text>
          </View>
        )}
      </View>
      <View style={estilos.contenedorDatosConfirmar}>
        <Etiqueta value={dniUsuario} icono={NombresIconosGenerales.dni} />
        <Etiqueta value={emailUsuario} icono={NombresIconosGenerales.correo} />
        <Etiqueta
          value={contrasenaUsuario}
          icono={NombresIconosGenerales.contrasena}
          puedeEsconderTexto
        />
      </View>
    </View>
  );

  const pantallaRegistroCompletado = (
    <View style={estilos.contenedorCampos}>
      <Text style={estilosGlobales.subtituloGrande}>Registro completado.</Text>
      <Text style={estilosGlobales.tituloSeccion}>Ya puede comenzar a pedir turnos...</Text>
    </View>
  );

  const pantallas = {
    /* eslint-disable no-useless-computed-key */
    [1]: pantallaDatosPrincipales,
    [2]: pantallaConfirmarDatos,
    [3]: pantallaRegistroCompletado
    /* Recuperar para V2
    [1]: pantallaDatosPrincipales,
    [2]: pantallaSolicitarFotografia,
    [3]: pantallaCamara,
    [4]: pantallaConfirmarDatos,
    [5]: pantallaRegistroCompletado
    Fin recuperar para V2 */
    /* eslint-enable no-useless-computed-key */
  };

  const textoBotonSiguientePorPantalla = {
    /* eslint-disable no-useless-computed-key */
    [1]: 'SIGUIENTE',
    [2]: 'CONFIRMAR DATOS',
    [3]: 'COMENZAR'
    // Recuperar para V2
    // [1]: 'SIGUIENTE',
    // [2]: 'TOMAR FOTO',
    // [4]: 'CONFIRMAR DATOS',
    // [5]: 'COMENZAR'
    // Fin recuperar para V2
    /* eslint-enable no-useless-computed-key */
  };

  const validarDatosRegistro = async () => {
    cambiarMostrarValidaciones(true);
    if (
      !emailUsuario
      || !contrasenaUsuario
      || contrasenaUsuario?.trim().length < 8
      || contrasenaUsuario?.includes(' ')
      || !nombreUsuario
      || !apellidoUsuario
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

  const loguearUsuario = async () => {
    try {
      const firebaseToken = await recuperarTokenFB();
      setFbtoken(firebaseToken);
      const payload = { email: emailUsuario, password: contrasenaUsuario, fbtoken: firebaseToken };
      const res = await login(payload);
      const respuesta = await res.json();
      return respuesta;
    } catch (error) {
      Alert.alert(recuperarMensajeError(error.message, 'Error durante el login.'));
    }
    return { success: false };
  };

  const enviarUsuario: Function = async (idFoto = null) => {
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
      Alert.alert(recuperarMensajeError(error.message, 'Error durante el login.'));
    }
    return { success: false };
  };

  /*
  const enviarAvatar: Function = async () => {
    const foto = new FormData();
    foto.append('file', { uri: uriFoto, name: 'avatar.jpg', type: 'image/jpg' });

    const res = await guardarAvatar({ avatar: foto });
    const respuesta = await res.json();
    return respuesta;
  };
  */

  const guardar = async () => {
    /*
    let respuesta = enviarAvatar();
    if (respuesta.success) {
      respuesta = enviarUsuario(respuesta.id);
      if (respuesta.success) {
        loguearUsuario();
      }
    }
    */
    const respuesta = await enviarUsuario();
    if (respuesta.success) {
      const respuestaLogin = await loguearUsuario();
      if (respuestaLogin.success) {
        // Almacena temporalmente el token para notificar al usuario
        // y permitir que acepte comenzar a operar la app.
        cambioToken(respuestaLogin.token);
        // V2 - cambioPantalla(5);
        cambioPantalla(3);
        // Fin V2
      } else {
        navigation.navigate('Login');
      }
    }
    setearBotonCargando(false);
  };

  const accionesBotonPrincipalDatosPrincipales = async () => {
    setearBotonCargando(true);
    const sonDatosValidos = await validarDatosRegistro();
    if (sonDatosValidos) {
      cambioPantalla(numeroPantalla + 1);
      cambiarMostrarValidaciones(false);
    }
    setearBotonCargando(false);
  };

  const accionesBotonPrincipalPorPantalla = {
    // Recuperar para V2
    /* eslint-disable no-useless-computed-key */
    /* [1]: accionesBotonPrincipalDatosPrincipales,
    [2]: () => cambioPantalla(numeroPantalla + 1),
    [4]: () => {
      setearBotonCargando(true);
      guardar();
    }, */
    // Almacena credenciales, esto cambia el navegador (Autenticado) y pasa a la Lobby.
    // [5]: () => fijarUsuarioLogueadoEnEstado(emailUsuario, tokenUsuario,
    // contrasenaUsuario, fbtoken)
    /* eslint-enable no-useless-computed-key */
    // Fin recuperar para V2

    /* eslint-disable no-useless-computed-key */
    [1]: accionesBotonPrincipalDatosPrincipales,
    [2]: () => {
      setearBotonCargando(true);
      guardar();
    },
    // Almacena credenciales, esto cambia el navegador (Autenticado) y pasa a la Lobby.
    [3]: () => fijarUsuarioLogueadoEnEstado(emailUsuario, tokenUsuario, contrasenaUsuario, fbtoken)
    /* eslint-enable no-useless-computed-key */
  };

  const Botonera = () => (
    /* Recuperar para V2
    <View style={estilos.subContenedorBotones}>
      { [1, 2, 4, 5].includes(numeroPantalla) // ---> Botón para avanzar en el proceso
        && (
        <BotonRedondeado
          manejadorClick={accionesBotonPrincipalPorPantalla[numeroPantalla]}
          cargando={botonCargando}
          estilo={{ marginTop: 20 }}
        >
          {textoBotonSiguientePorPantalla[numeroPantalla]}
        </BotonRedondeado>
        )}

      { [2, 4].includes(numeroPantalla) // ---> Botón para modificar datos
        && (
          <BotonRedondeado
            manejadorClick={() => cambioPantalla(1)}
            colorBorde={estilosGlobales.colorBordeBotonSecundario}
            colorFondo={estilosGlobales.colorFondoBotonSecundario}
            colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
            estilo={{ marginTop: 20 }}
          >
            MODIFICAR MIS DATOS
          </BotonRedondeado>
        )}
    Fin recuperar para V2 */

    <View style={estilos.subContenedorBotones}>
      { [1, 2, 3].includes(numeroPantalla) // ---> Botón para avanzar en el proceso
      && (
      <BotonRedondeado
        manejadorClick={accionesBotonPrincipalPorPantalla[numeroPantalla]}
        cargando={botonCargando}
        estilo={{ marginTop: 20 }}
      >
        {textoBotonSiguientePorPantalla[numeroPantalla]}
      </BotonRedondeado>
      )}

      { [2].includes(numeroPantalla) // ---> Botón para modificar datos
        && (
          <BotonRedondeado
            manejadorClick={() => cambioPantalla(1)}
            colorBorde={estilosGlobales.colorBordeBotonSecundario}
            colorFondo={estilosGlobales.colorFondoBotonSecundario}
            colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
            estilo={{ marginTop: 20 }}
          >
            MODIFICAR MIS DATOS
          </BotonRedondeado>
        )}
    </View>
  );

  return (
    <ScrollView style={estilos.contenedorGlobal} contentContainerStyle={{ flexGrow: 1 }}>
      { pantallas[numeroPantalla] }
      <Botonera />
    </ScrollView>
    /* V2 - <ScrollView style={estilos.contenedorGlobal} contentContainerStyle={{ flexGrow: 1 }}>
      { pantallas[numeroPantalla] }
      { numeroPantalla !== 3
        && (
          <Botonera />
        )}
    </ScrollView> */
  );
};

export default withErrorBoundary('Error durante el registro.', Registro);
