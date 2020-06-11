// @flow
import React, { useState, useContext } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Image
} from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import TextoIngreso from '../../componentes/comunes/textoIngreso';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import Etiqueta from '../../componentes/comunes/etiqueta';
import Camara from '../../componentes/comunes/camara';
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
  const [uriFoto, guardarUriFoto] = useState();
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
      right: 0,
      paddingRight: 10,
      paddingTop: 5,
      paddingBottom: 5
    }
  });

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
        />
        {emailExistente && mostrarValidaciones
          && (
          <Text style={estilosGlobales.mensajeError}>
            El email ingresado ya está registrado.
          </Text>
          )}
        {!emailUsuario && mostrarValidaciones
            && <Text style={estilosGlobales.mensajeError}>Dato requerido.</Text>}
        <TextoIngreso
          placeholderText="Contraseña"
          value={contrasenaUsuario}
          icono={NombresIconosGenerales.contrasena}
          manejadorCambioTexto={cambioContrasena}
          esconderTexto
        />
        {!contrasenaUsuario && mostrarValidaciones
            && <Text style={estilosGlobales.mensajeError}>Dato requerido.</Text>}
        <TextoIngreso
          placeholderText="Nombre"
          value={nombreUsuario}
          icono={NombresIconosGenerales.usuario}
          manejadorCambioTexto={cambioNombre}
        />
        {!nombreUsuario && mostrarValidaciones
            && <Text style={estilosGlobales.mensajeError}>Dato requerido.</Text>}
        <TextoIngreso
          placeholderText="Apellido"
          value={apellidoUsuario}
          icono={NombresIconosGenerales.usuario}
          manejadorCambioTexto={cambioApellido}
        />
        {!apellidoUsuario && mostrarValidaciones
            && <Text style={estilosGlobales.mensajeError}>Dato requerido.</Text>}
        <TextoIngreso
          placeholderText="DNI"
          value={dniUsuario}
          icono={NombresIconosGenerales.dni}
          manejadorCambioTexto={cambioDNI}
          esNumerico
          largoMaximo={8}
        />
        {DNIExistente && mostrarValidaciones
          && <Text style={estilosGlobales.mensajeError}>El DNI ingresado ya está registrado.</Text>}
        {!dniUsuario && mostrarValidaciones
            && <Text style={estilosGlobales.mensajeError}>Dato requerido.</Text>}
      </View>
    </View>
  );

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

  const pantallaConfirmarDatos = (
    <View style={estilos.contenedorCampos}>
      <View style={estilos.encabezadoPantallaConfirmar}>
        <View style={{ width: '60%' }}>
          <Etiqueta value={`${nombreUsuario} ${apellidoUsuario}`} icono={NombresIconosGenerales.usuario} />
        </View>
        <View style={estilos.contenedorFotografia}>
          <Image
            source={{ uri: uriFoto, isStatic: true }}
            style={{ width: '100%', height: '100%', borderRadius: 100 }}
          />
        </View>
      </View>
      <View style={estilos.contenedorDatosConfirmar}>
        <Etiqueta value={dniUsuario} icono={NombresIconosGenerales.dni} />
        <Etiqueta value={emailUsuario} icono={NombresIconosGenerales.correo} />
        <Etiqueta
          value={contrasenaUsuario}
          icono={NombresIconosGenerales.contrasena}
          esconderTexto
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
    [2]: pantallaSolicitarFotografia,
    [3]: pantallaCamara,
    [4]: pantallaConfirmarDatos,
    [5]: pantallaRegistroCompletado
    /* eslint-enable no-useless-computed-key */
  };

  const textoBotonSiguientePorPantalla = {
    /* eslint-disable no-useless-computed-key */
    [1]: 'SIGUIENTE',
    [2]: 'TOMAR FOTO',
    [4]: 'CONFIRMAR DATOS',
    [5]: 'COMENZAR'
    /* eslint-enable no-useless-computed-key */
  };

  const validarDatosRegistro = async () => {
    cambiarMostrarValidaciones(true);
    if (!emailUsuario || !contrasenaUsuario || !nombreUsuario || !apellidoUsuario || !dniUsuario) {
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
    const payload = { email: emailUsuario, password: contrasenaUsuario };
    const res = await login(payload);
    const respuesta = await res.json();
    return respuesta;
  };

  const enviarUsuario: Function = async (idFoto = null) => {
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
        cambioPantalla(5);
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
    /* eslint-disable no-useless-computed-key */
    [1]: accionesBotonPrincipalDatosPrincipales,
    [2]: () => cambioPantalla(numeroPantalla + 1),
    [4]: () => {
      setearBotonCargando(true);
      guardar();
    },
    // Almacena credenciales, esto cambia el navegador (Autenticado) y pasa a la Lobby.
    [5]: () => fijarUsuarioLogueadoEnEstado(emailUsuario, tokenUsuario, contrasenaUsuario)
    /* eslint-enable no-useless-computed-key */
  };

  const Botonera = () => (
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
    </View>
  );

  return (
    <ScrollView style={estilos.contenedorGlobal} contentContainerStyle={{ flexGrow: 1 }}>
      { pantallas[numeroPantalla] }
      { numeroPantalla !== 3
        && (
          <Botonera />
        )}
    </ScrollView>
  );
};

export default withErrorBoundary('Error durante el registro.', Registro);
