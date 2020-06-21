// @flow
import React from 'react';
/* import { firebase } from '@react-native-firebase/messaging';
import { Alert } from 'react-native'; */
import Navegador from './src/componentes/navegacion';
import { ProveedorContextoEstados } from './src/lib/contextoEstados';
import { ContextoEstilosGlobalesProveedor } from './src/lib/contextoEstilosGlobales';

/*
const createNotificationListeners = () => {
  const messaging = firebase.messaging();
  messaging.setBackgroundMessageHandler = (payload => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
    return Alert.alert(notificationTitle);
  });

  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
  });
};
*/

export default function App() {
  return (
    <ProveedorContextoEstados>
      <ContextoEstilosGlobalesProveedor>
        <Navegador />
      </ContextoEstilosGlobalesProveedor>
    </ProveedorContextoEstados>
  );
}
