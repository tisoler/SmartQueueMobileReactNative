// @flow
import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { obtenerTurnosDisponibles, generarTurno } from '../../lib/servicios';
import { ContextoEstados } from '../../lib/contextoEstados';
import { procesarMensajeError, esTokenValido, } from '../../lib/ayudante';
import BotonRipple from '../../componentes/comunes/botonRipple';

function TurnosDisponibles(props) {
  const {
    centro, categoria, fijarDiaSeleccionado, diaSeleccionado, elegirTipoTurno, navigation,
  } = props;
  const {
    estadoLogin,
    estadoFbToken,
    estadoTemaUsuario,
    fijarUsuarioLogueadoEnEstado,
    agregarTurnoAgendadoActivoEnEstado,
    fijarTurnoActualEnEstado,
  } = useContext(ContextoEstados);
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const [cargando, fijarCargando] = useState(true);
  const [horarioSeleccionado, fijarHorarioSeleccionado] = useState('');
  const turnos = useRef();

  const estilos = StyleSheet.create({
    contenedorTurnos: {
      flex: 1,
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    botonTurno: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      borderWidth: 2,
    },
    turno: {
      color: '#646566',
      fontSize: 18,
    },
    contenedorFechaElegida: {
      marginTop: 5,
      borderRadius: 8,
      backgroundColor: '#F1F1F1',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10
    },
    fechaElegida: {
      color: '#959595',
      fontSize: 17,
    },
    contenedorConfirmacion: {
      flex: 1,
      width: '90%',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contenedorMensaje: {
      alignItems: 'center',
      backgroundColor: '#fff',
      width: '100%',
      paddingBottom: 15
    },
    titulo: {
      textAlign: 'center',
      fontSize: 19,
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#8B6CC6',
      borderRadius: 15,
      height: 45,
      lineHeight: 45,
      width: 205,
      marginTop: 10,
      marginBottom: 20,
    },
    mensaje: {
      fontSize: 18,
      color: '#959595',
      padding: 3,
      textAlign: 'center',
    },
  });

  useEffect(() => {
    const consultarTurnosDisponibles = () => {
      obtenerTurnosDisponibles(estadoLogin.token, centro?.id, diaSeleccionado)
        .then(res => res.json())
        .then(respuesta => {
          if (respuesta.success) {
            turnos.current = respuesta.response;
            fijarCargando(false);
          } else {
            fijarCargando(false);
            Alert.alert('Error al obtener días disponibles.');
          }
        })
        .catch((error) => {
          if (esTokenValido(
              error?.message,
              fijarUsuarioLogueadoEnEstado,
              estadoLogin.email,
              estadoFbToken,
              estadoTemaUsuario
          )) {
            fijarCargando(false);
            Alert.alert(procesarMensajeError(error.message, 'Error durante la carga de días disponibles.'));
          }
        });
    };

    consultarTurnosDisponibles();
  }, [diaSeleccionado]);

  const confirmarTurno = () => {
    fijarCargando(true);

    const crearTurno = () => {
      const turno = {
        date: diaSeleccionado,
        time: horarioSeleccionado,
        CategoryId: categoria.id,
        CenterId: centro.id,
      };
      generarTurno(estadoLogin.token, turno)
        .then(res => res.json())
        .then(respuesta => {
          if (respuesta.success) {
            agregarTurnoAgendadoActivoEnEstado(respuesta?.response);
            fijarTurnoActualEnEstado(respuesta?.response, 0);
            navigation.navigate('Turno');
          } else {
            fijarCargando(false);
            Alert.alert('Error al obtener el turno.');
          }
        })
        .catch((error) => {
          if (esTokenValido(
              error?.message,
              fijarUsuarioLogueadoEnEstado,
              estadoLogin.email,
              estadoFbToken,
              estadoTemaUsuario
          )) {
            fijarCargando(false);
            Alert.alert(procesarMensajeError(error.message, 'Error durante la generación del turno.'));
          }
        });
    };

    crearTurno();
  };

  const fechaElegidaArreglo = diaSeleccionado.split('-');
  const fechaConFormato = `${fechaElegidaArreglo[2]}/${fechaElegidaArreglo[1]}/${fechaElegidaArreglo[0]}`;

  if (cargando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={estilosGlobales.colorFondoLogoLogin} />
      </View>
    );
  }

  const Turnos = () => (
    <View style={estilos.contenedorTurnos}>
      <View style={estilos.contenedorFechaElegida}>
        <View style={{ flexDirection: 'column', width: '35%', }}>
          <Text style={estilos.fechaElegida}>Fecha elegida</Text>
          <Text style={estilos.fechaElegida}>{fechaConFormato}</Text>
        </View>
        <View style={{ width: '65%', }}>
          <BotonRedondeado
            key="cancelar"
            width="100%"
            manejadorClick={() => fijarDiaSeleccionado()}
            estilo={{ marginTop: 10 }}
            colorBorde={estilosGlobales.colorEfectoClickBotonSecundario}
            colorFondo="#ffffff"
            colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
            colorTexto={estilosGlobales.colorFondoBotonPrincipal}
            flechaAlPrincipio
          >
            Cambiar fecha
          </BotonRedondeado>
        </View>
      </View>

      <Text style={{ marginTop: 10, fontSize: 18, color: estilosGlobales.colorFondoLogoLogin }}>
        Horarios
      </Text>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', marginTop: 10, marginBottom: 15 }}
      >
        <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
          {turnos.current?.filter(turno => turno.available).map(turno => (
            <BotonRipple
              width="70%"
              height={60}
              key={turno.hour}
              estilo={estilos.botonTurno}
              colorFondo="#ffffff"
              colorBorde="#6BABCA"
              borderRadius={5}
              manejadorClick={() => fijarHorarioSeleccionado(turno.hour)}
            >
              <Text style={estilos.turno}>{`${turno.hour} hs`}</Text>
            </BotonRipple>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const PopupConfirmacion = () => (
    <View style={estilos.contenedorConfirmacion}>
      <View style={estilos.contenedorMensaje}>
        <Text style={estilos.titulo}>Confirmar turno</Text>
        <Text style={estilos.mensaje}>
          {`Fecha: ${fechaConFormato} - Horario: ${horarioSeleccionado}`}
        </Text>
        <Text style={estilos.mensaje}>
          ¿Desea tomar el turno?
        </Text>
      </View>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <BotonRedondeado
          manejadorClick={() => confirmarTurno()}
          estilo={{ marginTop: 5 }}
        >
          Confirmar
        </BotonRedondeado>
        <BotonRedondeado
          manejadorClick={() => fijarHorarioSeleccionado('')}
          estilo={{ marginTop: 5 }}
          colorBorde="#ffffff"
          colorFondo="#ffffff"
          colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
          colorTexto={estilosGlobales.colorFondoBotonPrincipal}
          flechaAlPrincipio
        >
          Cambiar turno
        </BotonRedondeado>
        <BotonRedondeado
          manejadorClick={() => fijarDiaSeleccionado()}
          estilo={{ marginTop: 5 }}
          colorBorde="#ffffff"
          colorFondo="#ffffff"
          colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
          colorTexto={estilosGlobales.colorFondoBotonPrincipal}
          flechaAlPrincipio
        >
          Cambiar fecha
        </BotonRedondeado>
        <BotonRedondeado
          manejadorClick={() => elegirTipoTurno()}
          estilo={{ marginTop: 5 }}
          colorBorde="#ffffff"
          colorFondo="#ffffff"
          colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
          colorTexto={estilosGlobales.colorFondoBotonPrincipal}
          flechaAlPrincipio
        >
          Cancelar
        </BotonRedondeado>
      </View>
    </View>
  );

  return !horarioSeleccionado
    ? <Turnos />
    : <PopupConfirmacion />;
}

export default TurnosDisponibles;
