import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import { iconosCentros } from '../../lib/constantes';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoStates } from '../../lib/contextoStates';
import { estimarDemora, cancelarTicket, confirmarAsistencia } from '../../lib/servicios';

const CentrosAtencion = ({ route, navigation }) => {
  const { turno, demoraTurnoCreado } = route.params;
  const { loginState } = useContext(ContextoStates);
  const [demora, setDemora] = useState([]);
  console.log(turno);

  useEffect(() => {
    // Si viene de crear el turno usa la misma demora que le informaó en la pantalla anterior.
    // Si está consultando un turno llama al estimador de demora.
    if(demoraTurnoCreado == null) { 
      estimarDemora(loginState.token, turno.Category.id, turno.Center.id)
      .then(res => res.json())
      .then(respuesta => {
        setDemora(respuesta.response.wait);
      })
      .catch(error => alert('Error en la solicitud de turno.'));
    } else {
      setDemora(demoraTurnoCreado);
    }
  }, [demora]);

  const cancelarTurno = () => {
    cancelarTicket(loginState.token, turno.id)
      .then(res => res.json())
      .then(() => {
        navigation.pop(2);
      })
      .catch(error => alert('Error al cancelar el turno.'));
  }

  const confirmarPresencia = () => {
    confirmarAsistencia(loginState.token, turno.Center.id)
      .then(res => res.json())
      .then(respuesta => {
        alert(respuesta);
      })
      .catch(error => alert('Error al cancelar el turno.'));
  }

	return (
		<View style={estilos.container}>
      <Text>Evaluacion</Text>
		</View>
	);
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: '#0084a8',
    flexDirection: 'column',
    alignItems: 'center'
	}
});

export default withErrorBoundary('Error en evaluación del turno.', CentrosAtencion);