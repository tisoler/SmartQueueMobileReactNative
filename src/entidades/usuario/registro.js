// @flow
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity
} from 'react-native';
import {
  FontAwesomeIcon, faAt, faKey, faUserAstronaut, faIdCard, faCameraRetro
} from '@fortawesome/free-solid-svg-icons';
import { RNCamera, FaceDetector } from 'react-native-camera';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import TextoIngreso from '../../componentes/comunes/textoIngreso';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0084a8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subContenedor: {
    flex: 0.65,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '95%',
    marginBottom: 20
  },
  subContenedorFoto: {
    flex: 0.2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '95%',
    marginBottom: 20
  },
  subContenedorBotones: {
    flex: 0.35,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '95%'
  },
  textoAviso: {
    fontSize: 20,
    color: '#fff',
    margin: 20,
    textAlign: 'center'
  }
});

const Registro = () => {
  const [numeroPantalla, cambioPantalla] = useState(1);
  const [emailUsuario, cambioEmail] = useState('');
  const [contrasenaUsuario, cambioContrasena] = useState('');
  const [nombreUsuario, cambioNombre] = useState('');
  const [apellidoUsuario, cambioApellido] = useState('');
  const [dniUsuario, cambioDNI] = useState('');

  const pantallaDatosPrincipales = (
    <View style={estilos.subContenedor}>
      <TextoIngreso
        placeholderText="e-mail"
        value={emailUsuario}
        icono={faAt}
        manejadorCambioTexto={cambioEmail}
      />
      <TextoIngreso
        placeholderText="Contraseña"
        value={contrasenaUsuario}
        icono={faKey}
        manejadorCambioTexto={cambioContrasena}
        esconderTexto
      />
      <TextoIngreso
        placeholderText="Nombre"
        value={nombreUsuario}
        icono={faUserAstronaut}
        manejadorCambioTexto={cambioNombre}
      />
      <TextoIngreso
        placeholderText="Apellido"
        value={apellidoUsuario}
        icono={faUserAstronaut}
        manejadorCambioTexto={cambioApellido}
      />
      <TextoIngreso
        placeholderText="DNI"
        value={dniUsuario}
        icono={faIdCard}
        manejadorCambioTexto={cambioDNI}
        esNumerico
        largoMaximo={8}
      />
    </View>
  );

  const pantallaFotografia = (
    <View style={estilos.subContenedorFoto}>
      <Text style={estilos.textoAviso}>
        Es necesario que se tome una foto a fin de ser reconocida/o al momento de ser atendida/o.
      </Text>
    </View>
  );

  const pantallaCamara = (
    <View style={estilos.contenedor}>
      <RNCamera
        captureAudio={false}
      >
        <View>
          <TouchableOpacity>
            <FontAwesomeIcon style={{ lineHeight: 70 }} size={30} fill="#fff" icon={faCameraRetro} />
            <Text>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </RNCamera>
    </View>
  );

  const pantallas = {
    /* eslint-disable no-useless-computed-key */
    [1]: pantallaDatosPrincipales,
    [2]: pantallaFotografia,
    [3]: pantallaCamara
    /* eslint-enable no-useless-computed-key */
  };

  const textoBoton = {
    /* eslint-disable no-useless-computed-key */
    [1]: 'SIGUIENTE',
    [2]: 'TOMAR FOTO'
    /* eslint-enable no-useless-computed-key */
  };

  return (
    <View style={estilos.contenedor}>
      { pantallas[numeroPantalla] }
      { numeroPantalla !== 3
        && (
          <View style={estilos.subContenedorBotones}>
            <BotonRedondeado
              manejadorClick={() => cambioPantalla(numeroPantalla + 1)}
              cargando={false}
              color="#fff"
            >
              {textoBoton[numeroPantalla]}
            </BotonRedondeado>
          </View>
        )}
    </View>
  );
};

export default withErrorBoundary('Error durante el registro.', Registro);
