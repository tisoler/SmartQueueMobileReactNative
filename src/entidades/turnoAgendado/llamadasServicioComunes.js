// @flow
import { Alert } from 'react-native';
import { obtenerTurno, obtenerTurnosParaUsuario } from '../../lib/servicios';
import { procesarMensajeError, esTokenValido } from '../../lib/ayudante';

const consultarTurnosDeUsuario = async (
  estadoLogin: Object,
  fijarTurnosAgendadosEnEstado: Function
) => {
  const res = await obtenerTurnosParaUsuario(estadoLogin.token);
  const respuesta = await res.json();
  if (respuesta.success) {
    fijarTurnosAgendadosEnEstado(respuesta.response);
  } else {
    Alert.alert('Error al actualizar sus turnos.');
  }
};

// Este método se llama desde la pantalla de Turnos
// y desde el botón para refrescar turno del navegador.
// Por eso se unificó el comportamiento acá.
const recuperarTurno = async (
  estadoLogin: Object,
  estadoFbToken: Object,
  estadoTurnoActual: Object,
  estadoTemaUsuario: string,
  estadoIdiomaUsuario: string,
  fijarTurnoActualEnEstado: Function,
  fijarTurnosAgendadosEnEstado: Function,
  fijarUsuarioLogueadoEnEstado: Function,
  navigation: Object

) => {
  try {
    const res = await obtenerTurno(estadoLogin?.token, estadoTurnoActual?.turno?.Center?.id);
    const respuesta = await res.json();
    if (respuesta?.success) {
      // Si está cancelado, perdido o nunca se presentó
      // 1 - refresca los turnos del usuario
      // 2 - Si no es finished vuelve a la Lobby, si es finished irá por navegador a la evaluación.
      // Si es turno perdido lo avisa.
      if (!['waiting', 'ready'].includes(respuesta?.response?.status)) {
        await consultarTurnosDeUsuario(estadoLogin, fijarTurnosAgendadosEnEstado);
        if (['missed', 'blackhole'].includes(respuesta?.response?.status)) {
          Alert.alert('Ha perdido el turno. Solicite otro.');
        }
        if (respuesta?.response?.ticket?.status !== 'finished') {
          navigation.navigate('Lobby');
        }
      }
      fijarTurnoActualEnEstado(respuesta?.response, null);
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
      estadoTemaUsuario,
      estadoIdiomaUsuario,
    )) {
      Alert.alert(procesarMensajeError(error.message, 'Error en la consulta de turno.'));
    }
  }
};

export default recuperarTurno;
