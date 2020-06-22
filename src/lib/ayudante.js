// @flow
import messaging, { firebase } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import { mensajes } from './constantes';

export const guardarDatosLocalmente = async (clave: string, valor: string) => {
  try {
    await AsyncStorage.setItem(clave, valor);
  } catch (error) {
    // Error
  }
};

export const recuperarDatosLocalmente = async (clave: string) => {
  try {
    const value = await AsyncStorage.getItem(clave);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    // Error
  }
  return null;
};

export const procesarMensajeError = (mensajeError: string, mensajeGenerico?: string) => {
  if (mensajeError?.trim().toLocaleLowerCase() === 'network request failed') {
    return mensajes.sinConexion;
  }
  if (mensajeError?.trim().toLowerCase().includes('connect econnrefused')) {
    return mensajes.sinServicio;
  }
  return mensajeGenerico || mensajeError;
};

export const esTokenValido = (
  mensaje: string,
  fijarUsuarioLogueadoEnEstado: Function,
  email: string,
  fbtoken: string,
  estadoTemaUsuario: string
) => {
  if (mensaje.trim().toLowerCase().includes('unexpected token')) {
    fijarUsuarioLogueadoEnEstado(email, '', fbtoken, estadoTemaUsuario);
    return false;
  }
  return true;
};

// ----- Sección de Firebase ------

const obtenerTokenFb = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      return fcmToken;
    }
  }
  return null;
};

const solicitarPermisoFb = async () => messaging()
  .requestPermission()
  .then(async () => {
    const fbToken = await obtenerTokenFb();
    return fbToken;
  })
  .catch(() => {
    // Error;
  });

const pedirTokenFb = async () => {
  const habilitado = await messaging().hasPermission();
  if (habilitado) {
    return obtenerTokenFb();
  }
  return solicitarPermisoFb();
};

// Listener para segundo plano
export const segundoPlano = async (remoteMessage: Object) => {
  console.log('Message handled in the background!', remoteMessage);
};

export const crearClienteFirebase = (cambiarTokenFirebaseAccion: Function) => {
  // Listener para cuando el token de Firebase se ha refrescado
  messaging().onTokenRefresh(async () => {
    const nuevoTokenFb = await pedirTokenFb();
    cambiarTokenFirebaseAccion(nuevoTokenFb);
  });

  // Listener para primer plano
  messaging().onMessage((payload) => {
    console.log('primer plano. ', payload);
  });

  messaging().setBackgroundMessageHandler(segundoPlano);

  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log('FCM Message Data:', remoteMessage.data);

    // Update a users messages list using AsyncStorage
    const currentMessages = await AsyncStorage.getItem('messages');
    const messageArray = JSON.parse(currentMessages);
    console.log('FCM Message Data:', messageArray);
  });

  /* messaging().setBackgroundMessageHandler = async (payload) => {
    console.log('segundo plano', payload);
    //Customize notification here
     const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  }; */
};

export const recuperarTokenFB = async () => {
  const tokeFBLocal = await recuperarDatosLocalmente('@tokenFb');
  if (tokeFBLocal) return tokeFBLocal;
  return pedirTokenFb();
};

// ----- Fin sección de Firebase ------
