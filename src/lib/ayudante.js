/* eslint-disable camelcase */
// @flow
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import { mensajes } from './constantes';
import { actualizarTokenFb, obtenerTicketsParaUsuario } from './servicios';

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

// eslint-disable-next-line no-unused-vars
const AsyncAlerta = (titulo: string, mensaje: string) => new Promise((resolve, reject) => {
  Alert.alert(
    titulo,
    mensaje,
    [
      { text: 'Sí', onPress: () => resolve(true) },
      { text: 'Más tarde', onPress: () => resolve(false) }
    ],
    { cancelable: false }
  );
});

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

const notificarAvanceTurno = (
  payload: Object,
  navigation: Object,
  fijarTurnoActualEnEstado: Function
) => {
  if (payload?.data?.center_id && payload?.data?.app_icon) {
    AsyncAlerta(
      payload.notification?.title || 'Avence de turno',
      payload.notification?.body ? `${payload.notification?.body} ¿Desea ver el turno?` : `Su turno ${payload.data.code || ''} ha avanzado. ¿Desea ver el turno?`,
    )
      .then(respuesta => {
        if (respuesta) {
          const turno = {
            Center: { id: payload.data.center_id, app_icon: payload.data.app_icon }
          };
          fijarTurnoActualEnEstado(turno, null);
          navigation.navigate('Turno', { turno });
        }
      });
  }
};

const notificarEvaluarTurno = (
  payload: Object,
  estadoLogin: Object,
  fijarTurnosEnEstado: Function,
  asignarEstadoIrEvaluacion: Function
) => {
  AsyncAlerta(
    payload.notification?.title || `Evaluación de atención de ${payload?.data?.center}`,
    payload.notification?.body ? `${payload.notification?.body} ¿Desea evaluarlo ahora?` : 'Tiene un turno para evaluar. ¿Desea evaluarlo ahora?',
  )
    .then(async respuesta => {
      if (respuesta) {
        asignarEstadoIrEvaluacion(true);
        const res = await obtenerTicketsParaUsuario(estadoLogin?.token);
        const resTickets = await res.json();
        if (resTickets.success) {
          fijarTurnosEnEstado(resTickets?.response);
        } else {
          Alert.alert('Error durante la carga de turnos activos.');
        }
      }
    });
};

// Listener para segundo plano
export const segundoPlano = (
  navigation: Object,
  fijarTurnoActualEnEstado: Function,
  estadoLogin: Object,
  fijarTurnosEnEstado: Function,
  asignarEstadoIrEvaluacion: Function
) => async (payload: Object) => {
  if (payload?.data?.tipo_notificacion) {
    switch (payload.data.tipo_notificacion) {
      case '1': // N turnos para el suyo
        notificarAvanceTurno(payload, navigation, fijarTurnoActualEnEstado);
        break;
      case '2': // Evaluacion
        notificarEvaluarTurno(
          payload,
          estadoLogin,
          fijarTurnosEnEstado,
          asignarEstadoIrEvaluacion
        );
        break;
      default:
        break;
    }
  }
};

export const crearClienteFirebase = (
  estadoLogin: Object,
  cambiarTokenFirebaseEnEstado: Function,
  navigation: Object,
  fijarTurnoActualEnEstado: Function,
  fijarTurnosEnEstado: Function,
  asignarEstadoIrEvaluacion: Function
) => {
  // Listener para cuando el token de Firebase se ha refrescado
  messaging().onTokenRefresh(async () => {
    const nuevoTokenFb = await pedirTokenFb();
    cambiarTokenFirebaseEnEstado(nuevoTokenFb);
    if (nuevoTokenFb) {
      actualizarTokenFb(estadoLogin.token, nuevoTokenFb);
    }
  });

  // Listener para primer plano
  messaging().onMessage((payload) => {
    if (payload?.data?.tipo_notificacion) {
      switch (payload.data.tipo_notificacion) {
        case '1': // N turnos para el suyo
          notificarAvanceTurno(payload, navigation, fijarTurnoActualEnEstado);
          break;
        case '2': // Evaluacion
          notificarEvaluarTurno(
            payload,
            estadoLogin,
            fijarTurnosEnEstado,
            asignarEstadoIrEvaluacion
          );
          break;
        default:
          break;
      }
    }
  });

  messaging().setBackgroundMessageHandler(segundoPlano(
    navigation,
    fijarTurnoActualEnEstado,
    estadoLogin,
    fijarTurnosEnEstado,
    asignarEstadoIrEvaluacion
  ));

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
