/* eslint-disable camelcase */
// @flow
import * as React from 'react';
import { useContext, useState } from 'react';
import {
  View, StyleSheet, Text, ActivityIndicator, Alert
} from 'react-native';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import withDialogoEmergente from '../../hoc/withDialogoEmergente';
import { ContextoEstados } from '../../lib/contextoEstados';
import { estimarDemora, generarTicket } from '../../lib/servicios';
import BotonPopup from '../../componentes/comunes/botonPopup';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { procesarMensajeError, esTokenValido } from '../../lib/ayudante';
import { tipoTurno as tipoTurnoEnum } from '../../lib/constantes';

const CentrosAtencion = (props) => {
  const {
    centro,
    tipoTurno,
    navigation,
    elegirTipoTurno,
    elegirFechaTurno,
  } = props;
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const [turnoPedido, setTurnoPedido] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [categoriaSeleccionada, setCategoria] = useState({});
  const [demora, setDemora] = useState({});
  const {
    estadoLogin,
    estadoTurnosActivos,
    estadoFbToken,
    estadoTemaUsuario,
    agregarTurnoActivoEnEstado,
    fijarUsuarioLogueadoEnEstado,
    fijarTurnoActualEnEstado
  } = useContext(ContextoEstados);

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      width: '100%',
      backgroundColor: estilosGlobales.colorFondoContenedorDatos,
      flexDirection: 'column',
      alignItems: 'center'
    },
    contenedorConfirmacion: {
      width: '90%',
      backgroundColor: '#fff',
      alignItems: 'center',
      marginTop: 7
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
      marginBottom: 10,
    },
    mensaje: {
      fontSize: 18,
      padding: 3,
      textAlign: 'center',
      color: estilosGlobales.colorTextoConfirmacionTurno
    },
    contenedorBotonesConfirmacion: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      width: '100%'
    }
  });

  const pedirTurnoFila = (categoria) => {
    setTurnoPedido(true);
    setCargando(true);
    estimarDemora(estadoLogin.token, categoria.id, centro.id)
      .then(res => res.json())
      .then(respuesta => {
        setDemora(respuesta.response.wait);
        setCategoria(categoria);
        setCargando(false);
      })
      .catch((error) => {
        if (esTokenValido(
          error?.message,
          fijarUsuarioLogueadoEnEstado,
          estadoLogin.email,
          estadoFbToken,
          estadoTemaUsuario
        )) {
          Alert.alert(procesarMensajeError(error.message, 'Error en la solicitud de turno.'));
        }
      });
  };

  const confirmarTurno = () => {
    setCargando(true);
    generarTicket(estadoLogin.token, categoriaSeleccionada.id, centro.id)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta?.success) {
          agregarTurnoActivoEnEstado(respuesta?.response?.ticket);
          fijarTurnoActualEnEstado(respuesta?.response?.ticket, demora);
          navigation.navigate('Turno');
        } else {
          Alert.alert('Error en la solicitud de turno.');
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
          Alert.alert(procesarMensajeError(error.message, 'Error en la solicitud de turno.'));
        }
      });
  };

  const obtenerBotonesCategorias = () => (
    [...centro.Categories.map((categ, idx) => (
      <BotonRedondeado
        key={categ.id}
        manejadorClick={
          () => (tipoTurno === tipoTurnoEnum.fila
            ? pedirTurnoFila(categ)
            : elegirFechaTurno(categ)
          )
        }
        estilo={{ marginTop: 22 }}
        colorFondo={idx % 2 === 0
          ? estilosGlobales.colorFondoBotonPrincipal
          : '#8B6CC6'}
        colorBorde={idx % 2 === 0
          ? estilosGlobales.colorBordeBotonPrincipal
          : '#8B6CC6'}
        flechaAlFinal
      >
        { categ.description }
      </BotonRedondeado>
    )),
      <BotonRedondeado
        key="cancelar"
        manejadorClick={() => elegirTipoTurno()}
        estilo={{ marginTop: 22 }}
        colorBorde={estilosGlobales.colorEfectoClickBotonSecundario}
        colorFondo="#ffffff"
        colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
        colorTexto={estilosGlobales.colorFondoBotonPrincipal}
        flechaAlPrincipio
      >
        Cancelar
      </BotonRedondeado>
    ]
  );

  const turnosAnteriores = demora?.tickets != null ? demora?.tickets : -1;
  // eslint-disable-next-line no-nested-ternary
  const mensajeTurnosAnteriores = turnosAnteriores === 1
    ? 'Hay 1 turno antes del suyo.'
    : turnosAnteriores > 1
      ? `Hay ${turnosAnteriores} turnos antes del suyo.`
      : 'No hay ningún turno antes del suyo.';

  const obtenerPopupConfirmacion = () => (
    <View style={estilos.contenedorConfirmacion}>
      <View style={estilos.contenedorMensaje}>
        <Text style={estilos.titulo}>{ categoriaSeleccionada.description }</Text>
        <Text style={estilos.mensaje}>{mensajeTurnosAnteriores}</Text>
        <Text style={estilos.mensaje}>
          {`La demora estimada es de ${demora?.hours > 0 ? `${demora?.hours} hs.` : ''} ${demora?.minutes ? parseInt(demora.minutes, 10) : '?'} minutos.`}
        </Text>
        <Text style={estilos.mensaje}>
          ¿Desea tomar el turno?
        </Text>
      </View>
      <View style={estilos.contenedorBotonesConfirmacion}>
        <BotonPopup
          height={80}
          width="50%"
          manejadorClick={() => setTurnoPedido(false)}
          colorFondo={estilosGlobales.colorFondoGlobal}
        >
          No
        </BotonPopup>
        <BotonPopup
          height={80}
          width="50%"
          manejadorClick={() => confirmarTurno()}
          colorFondo={estilosGlobales.colorFondoBotonPrincipal}
        >
          Sí
        </BotonPopup>
      </View>
    </View>
  );

  // Cuando el usuario confirma el turno (pantalla turno) y vuelve con el "volver" del SO
  // no tiene que cargar esta pantalla, debe ir a la lobby.
  if (estadoTurnosActivos.some(t => t.Center.id === centro.id)) {
    navigation.navigate('Lobby');
  }

  const obtenerRender = () => {
    if (!turnoPedido) {
      return obtenerBotonesCategorias();
    }
    if (cargando) {
      return <ActivityIndicator size="large" color="#fff" />;
    }
    return obtenerPopupConfirmacion();
  };

  return (
    <View style={estilos.contenedor}>
      {obtenerRender()}
    </View>
  );
};

export default withErrorBoundary('Error en centro de atención.', withDialogoEmergente(CentrosAtencion));
