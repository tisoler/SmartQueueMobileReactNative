// @flow
import React from 'react';
import messaging from '@react-native-firebase/messaging';
import Navegador from './src/componentes/navegacion';
import { ProveedorContextoEstados } from './src/lib/contextoEstados';
import { ProveedorContextoEstilosGlobales } from './src/lib/contextoEstilosGlobales';
import { ProveedorContextoIdiomas } from './src/lib/contextoIdioma';
import { ProveedorContextoDialogoEmergente } from './src/lib/contextoDialogoEmergente';
import { guardarDatosLocalmente, recuperarDatosLocalmente } from './src/lib/ayudante';

// LISTENER - Segundo plano con aplicación cerrada
// Debe escuchar fuera de los componentes
// La otra parte está en "ayudante". No podemos usar states, usamos almacenamiento local.
messaging().setBackgroundMessageHandler(async payload => {
  // eslint-disable-next-line camelcase
  if (payload?.data?.tipo_notificacion) {
    switch (payload.data.tipo_notificacion) {
      case '1': // N turnos para el suyo
        guardarDatosLocalmente('@turnoNotificado', JSON.stringify({ Center: { id: payload.data.center_id, app_icon: payload.data.app_icon } }));
        break;
      case '2': // Evaluacion
        // Al abrirse la app de 0 te envía a evaluación porque
        // carga los turnos y hay alguno para evaluar
        // En un futuro quizá tengamos que definir qué hacer aquí-

        // Si el turno a evaluar tenía una notificaición de tipo 1 (n turnos)
        // lo remueve del almacenamiento local, ya no se necesita.
        // eslint-disable-next-line no-case-declarations
        const turnoGuardadoLocal = await recuperarDatosLocalmente('@turnoNotificado');
        // eslint-disable-next-line camelcase
        if (turnoGuardadoLocal && turnoGuardadoLocal?.Center?.id === payload?.data?.center_id) {
          guardarDatosLocalmente('@turnoNotificado', '');
        }
        break;
      default:
        break;
    }
  }
});

export default () => (
  <ProveedorContextoEstados>
    <ProveedorContextoEstilosGlobales>
      <ProveedorContextoIdiomas>
        <ProveedorContextoDialogoEmergente>
          <Navegador />
        </ProveedorContextoDialogoEmergente>
      </ProveedorContextoIdiomas>
    </ProveedorContextoEstilosGlobales>
  </ProveedorContextoEstados>
);
