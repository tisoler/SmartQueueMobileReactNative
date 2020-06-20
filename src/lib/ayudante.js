// @flow
import { firebase } from '@react-native-firebase/messaging';
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

const obtenerTokenFB = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      return fcmToken;
    }
  }
  return null;
};

const solicitarPermisoFB = async () => firebase.messaging()
  .requestPermission()
  .then(() => obtenerTokenFB())
  .catch(() => {
    // Error;
  });

export const recuperarTokenFB = async () => {
  const tokeFBLocal = await recuperarDatosLocalmente('@fbtoken');
  if (tokeFBLocal) return tokeFBLocal;

  const habilitado = await firebase.messaging().hasPermission();
  if (habilitado) {
    return obtenerTokenFB();
  }
  return solicitarPermisoFB();
};

export const recuperarMensajeError = (mensajeError: string, mensajeGenerico?: string) => {
  if (mensajeError?.trim().toLocaleLowerCase() === 'network request failed') {
    return mensajes.sinConexion;
  }
  if (mensajeError?.trim().toLowerCase().includes('connect econnrefused')) {
    return mensajes.sinServicio;
  }
  return mensajeGenerico || mensajeError;
};
