// @flow
import { Alert } from 'react-native';
import { obtenerTicket, obtenerTicketsParaUsuario } from '../../lib/servicios';
import { procesarMensajeError, esTokenValido } from '../../lib/ayudante';

const consultarTicketsDeUsuario = async (
  estadoLogin: Object,
  fijarTurnosEnEstado: Function
) => {
  const res = await obtenerTicketsParaUsuario(estadoLogin.token);
  const respuesta = await res.json();
  if (respuesta.success) {
    fijarTurnosEnEstado(respuesta.response);
  } else {
    Alert.alert('Error al actualizar sus turnos.');
  }
};

// Este método se llama desde la pantalal de Turnos
// y desde el botón para refrescar turno del navegador.
// Por eso se unificó el comportamiento acá.
const recuperarTicket = async (
  estadoLogin: Object,
  estadoFbToken: Object,
  estadoTurnoActual: Object,
  estadoTemaUsuario: Object,
  fijarTurnoActualEnEstado: Function,
  fijarTurnosEnEstado: Function,
  fijarUsuarioLogueadoEnEstado: Function,
  navigation: Object

) => {
  try {
    const res = await obtenerTicket(estadoLogin?.token, estadoTurnoActual?.turno?.Center?.id);
    const respuesta = await res.json();
    if (respuesta?.success) {
      // Si está cancelado, perdido o nunca se presentó
      // 1 - refresca los turnos del usuario
      // 2 - Si no es finished vuelve a la Lobby, si es finished irá por navegador a la evaluación.
      // Si es turno perdido lo avisa.
      if (!['waiting', 'ready'].includes(respuesta?.response?.ticket?.status)) {
        await consultarTicketsDeUsuario(estadoLogin, fijarTurnosEnEstado);
        if (['missed', 'blackhole'].includes(respuesta?.response?.ticket?.status)) {
          Alert.alert('Ha perdido el turno. Solicite otro.');
        }
        if (respuesta?.response?.ticket?.status !== 'finished') {
          navigation.navigate('Lobby');
        }
      }
      fijarTurnoActualEnEstado(respuesta?.response?.ticket, respuesta?.response?.wait);
    } else {
      Alert.alert('Error en la consulta de turno.');
      navigation.navigate('Lobby');
    }
  } catch (error) {
    if (esTokenValido(
      error?.message,
      fijarUsuarioLogueadoEnEstado,
      estadoLogin.email,
      estadoFbToken,
      estadoTemaUsuario
    )) {
      Alert.alert(procesarMensajeError(error.message, 'Error en la consulta de turno.'));
    }
  }
};

export default recuperarTicket;
