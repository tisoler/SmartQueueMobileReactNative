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

export const recuperarTokenFB = async () => {
  const tokeFBLocal = await recuperarDatosLocalmente('@tokenFb');
  if (tokeFBLocal) return tokeFBLocal;
  return pedirTokenFb();
};

// Notificaciones
const irHaciaTurnoNotificado = (
  payload: Object,
  navigation: Object,
  fijarTurnoActualEnEstado: Function
) => {
  const turno = {
    Center: { id: payload.data.center_id }
  };
  fijarTurnoActualEnEstado(turno, null);
  navigation.navigate('Turno');
};

const notificarAvanceTurno = (
  payload: Object,
  navigation: Object,
  fijarTurnoActualEnEstado: Function,
  abrirDialogoEmergente: Function
) => {
  if (payload?.data?.center_id) {
    abrirDialogoEmergente(
      payload.notification?.title || 'Avence de turno',
      payload.notification?.body ? `${payload.notification?.body} ¿Desea ir al turno?` : `Su turno ${payload.data.code || ''} ha avanzado. ¿Desea ver el turno?`,
      'Sí',
      'Más tarde'
    )
      .then(respuesta => {
        if (respuesta) {
          irHaciaTurnoNotificado(
            payload,
            navigation,
            fijarTurnoActualEnEstado
          );
        }
      });
  }
};

const evaluarTurnoNotificado = async (
  estadoLogin: Object,
  fijarTurnosEnEstado: Function,
  asignarEstadoIrEvaluacion: Function
) => {
  asignarEstadoIrEvaluacion(true);
  const res = await obtenerTicketsParaUsuario(estadoLogin?.token);
  const resTickets = await res.json();
  if (resTickets.success) {
    fijarTurnosEnEstado(resTickets?.response);
  } else {
    Alert.alert('Error durante la carga de turnos activos.');
  }
};

const notificarEvaluarTurno = (
  payload: Object,
  estadoLogin: Object,
  fijarTurnosEnEstado: Function,
  asignarEstadoIrEvaluacion: Function,
  abrirDialogoEmergente: Function
) => {
  abrirDialogoEmergente(
      payload.notification?.title || `Evaluación de atención de ${payload?.data?.center}`,
      payload.notification?.body ? `${payload.notification?.body} ¿Desea evaluarlo ahora?` : 'Tiene un turno para evaluar. ¿Desea evaluarlo ahora?',
      'Sí',
      'Más tarde'
  )
    .then(async respuesta => {
      if (respuesta) {
        evaluarTurnoNotificado(
          estadoLogin,
          fijarTurnosEnEstado,
          asignarEstadoIrEvaluacion
        );
      }
    });
};

export const crearClienteFirebase = async (
  estadoLogin: Object,
  cambiarTokenFirebaseEnEstado: Function,
  navigation: Object,
  fijarTurnoActualEnEstado: Function,
  fijarTurnosEnEstado: Function,
  asignarEstadoIrEvaluacion: Function,
  abrirDialogoEmergente: Function
) => {
  // Listener para cuando el token de Firebase se ha refrescado
  messaging().onTokenRefresh(async () => {
    const nuevoTokenFb = await pedirTokenFb();
    cambiarTokenFirebaseEnEstado(nuevoTokenFb);
    if (nuevoTokenFb) {
      actualizarTokenFb(estadoLogin.token, nuevoTokenFb);
    }
  });

  // LISTENER - Primer plano
  messaging().onMessage((payload) => {
    if (payload?.data?.tipo_notificacion) {
      switch (payload.data.tipo_notificacion) {
        case '1': // N turnos para el suyo
          notificarAvanceTurno(
            payload,
            navigation,
            fijarTurnoActualEnEstado,
            abrirDialogoEmergente
          );
          break;
        case '2': // Evaluacion
          notificarEvaluarTurno(
            payload,
            estadoLogin,
            fijarTurnosEnEstado,
            asignarEstadoIrEvaluacion,
            abrirDialogoEmergente
          );
          break;
        default:
          break;
      }
    }
  });

  // LISTENER - Segundo plano con aplicación corriendo
  messaging().onNotificationOpenedApp(async (payload) => {
    if (payload?.data?.tipo_notificacion) {
      switch (payload.data.tipo_notificacion) {
        case '1': // N turnos para el suyo
          irHaciaTurnoNotificado(
            payload,
            navigation,
            fijarTurnoActualEnEstado
          );
          break;
        case '2': // Evaluacion
          evaluarTurnoNotificado(
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

  // LISTENER - Segundo plano con aplicación cerrada
  // Debe escuchar fuera de los componentes
  // La otra parte está en "app". No podemos usar states, usamos almacenamiento local.
  const turnoGuardadoLocal = await recuperarDatosLocalmente('@turnoNotificado');
  if (turnoGuardadoLocal) {
    const turnoNotificado = JSON.parse(turnoGuardadoLocal);
    if (turnoNotificado?.Center?.id) {
      await AsyncStorage.removeItem('@turnoNotificado');
      fijarTurnoActualEnEstado(turnoNotificado, null);
      navigation.navigate('Turno');
    }
  }
// ----- Fin sección de Firebase ------
};
