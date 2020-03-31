import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import withErrorBoundary from '../../enhancers/withErrorBoundary';
import { iconosCentros } from '../../lib/constantes';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoStates } from '../../lib/contextoStates';
import { estimarDemora, cancelarTicket, confirmarAsistencia } from '../../lib/servicios';

const Turno = ({ route, navigation }) => {
  const { turno, demoraTurnoCreado } = route.params;
  const { loginState } = useContext(ContextoStates);
  const [demora, setDemora] = useState([]);
  const [confirmoPresencia, setConfirmoPresencia] = useState(false);
  const [cargando, setCargando] = useState(false);
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
    setCargando(true);
    cancelarTicket(loginState.token, turno.id)
      .then(res => res.json())
      .then(() => {
        navigation.pop(2);
      })
      .catch(error => alert('Error al cancelar el turno.'));
  }

  const confirmarPresencia = () => {
    setConfirmoPresencia(true);
    confirmarAsistencia(loginState.token, turno.Center.id)
      .then(res => res.json())
      .then(respuesta => {
        setTimeout(() => navigation.pop(2), 1500);
      })
      .catch(error => { 
        alert('Error al confirmar presencia.');
        setConfirmoPresencia(false);
      });
  }

	return (
    <View style={estilos.container}>
      <Image style={estilos.imagen} source={iconosCentros[turno.Center.app_icon]}/>
      { !confirmoPresencia ? 
        (
          cargando ? <ActivityIndicator style={estilos.actividad} size='large' color='#fff' />
          : <View style={estilos.container}>
              <Text style={estilos.Titulo}>{turno.code}</Text>
              <Text style={estilos.textoTurno}>{turno.Priority.name} - {turno.Category.name}</Text>
              <Text style={estilos.textoTurno}>Turnos antes: {demora.tickets}</Text>
              <Text style={[estilos.textoTurno, estilos.margenUltimoTexto]}>Tiempo estimado: {demora.hours}h {demora.minutes}m</Text>
              <BotonRedondeado ManejadorClick={() => confirmarPresencia()} Cargando={false} Color='#fff'>
                YA ESTOY AQUÍ
              </BotonRedondeado>
              <BotonRedondeado ManejadorClick={() => cancelarTurno()} Cargando={false} Color='#fff'>
                CANCELAR TURNO
              </BotonRedondeado>
            </View>
        ) : (
          <View  style={estilos.container}>
            <Text style={estilos.Titulo}>Muchas gracias.</Text>
            <Text style={estilos.Titulo}>Que tenga un buen día.</Text>
          </View>
        )
      }
    </View>
	);
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: '#0084a8',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
	imagen: {
    height: 150,
    width: 150
  },
  Titulo: {
    fontSize: 26,
    color: '#fff',
		fontWeight: 'bold'
  },
  margenUltimoTexto: {
    marginBottom: 20
  },
  textoTurno: {
    fontSize: 19,
    color: '#fff',
    marginTop: 5
  }
});

export default withErrorBoundary('Error en turno.', Turno);
