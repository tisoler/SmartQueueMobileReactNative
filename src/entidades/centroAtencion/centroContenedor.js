/* eslint-disable camelcase */
// @flow
import * as React from 'react';
import {
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  View, StyleSheet, Text, Image, Animated,
} from 'react-native';
import { ContextoEstados } from '../../lib/contextoEstados';
import { IconosCentros, tipoTurno, pantalla } from '../../lib/constantes';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import CentroAtencion from './centroAtencion';
import TipoTurno from './tipoTurno';
import Calendario from '../turnoAgendado/calendario';

type Props = {
  navigation: any,
  route: any,
};

const CentroContenedor = ({ navigation, route }: Props) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const {
    estadoTurnosActivos, estadoTurnosAgendadosActivos, fijarTurnoActualEnEstado,
  } = useContext(ContextoEstados);
  const [pantallaActual, fijarPantallaActual] = useState(pantalla.tipoTurno);
  const [subtitulo, fijarSubtitulo] = useState('');
  const { centro } = route?.params;
  const [categoriaSeleccionada, fijarCategoriaSeleccionada] = useState();
  const [altoContenedorCentro] = useState(new Animated.Value(0));
  const [altoContenedorCentroChico] = useState(new Animated.Value(247));

  const estilos = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: estilosGlobales.colorFondoContenedorDatos,
      flexDirection: 'column',
      alignItems: 'center',
    },
    contenedorEncabezado: {
      backgroundColor: estilosGlobales.colorFondoGlobal,
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    subcontenedor: {
      flexDirection: pantallaActual !== pantalla.calendarioTurno ? 'column' : 'row',
      alignItems: 'center',
      width: '100%',
    },
    explicacion: {
      paddingBottom: pantallaActual !== pantalla.calendarioTurno ? 25 : 10,
    },
    imagenLogoCentro: {
      width: pantallaActual !== pantalla.calendarioTurno ? 150 : 80,
      height: pantallaActual !== pantalla.calendarioTurno ? 150 : 80,
      marginLeft: pantallaActual !== pantalla.calendarioTurno ? 0 : 20,
    },
    subtituloCentro: {
      paddingBottom: 25,
      width: pantallaActual !== pantalla.calendarioTurno ? '100%' : '70%',
    },
  });

  const animacionIngresoEncabezado = () => {
    Animated.timing(altoContenedorCentro, {
      toValue: 247,
      duration: 700,
      useNativeDriver: false,
    }).start();
  };

  const animacionAchicarEncabezado = () => {
    setTimeout(() => {
      Animated.timing(altoContenedorCentroChico, {
        toValue: 115,
        duration: 700,
        useNativeDriver: false,
      }).start();
    }, 500);
  };

  useEffect(() => {
    if (pantallaActual === pantalla.tipoTurno) {
      setTimeout(() => {
        animacionIngresoEncabezado();
      }, 400);
    }

    if (pantallaActual === pantalla.calendarioTurno) {
      setTimeout(() => {
        animacionAchicarEncabezado();
      }, 200);
    }
  }, [pantallaActual]);

  const obtenerTurnoParaCentro = (idCentro) => estadoTurnosActivos
    .find(turno => turno.Center.id === idCentro);
  const obtenerTurnoAgendadoParaCentro = (idCentro) => estadoTurnosAgendadosActivos
    .find(turno => turno.Center.id === idCentro);

  const turnoExistente = obtenerTurnoParaCentro(centro.id);
  const turnoAgendadoExistente = obtenerTurnoAgendadoParaCentro(centro.id);

  function pedirTurnoFila() {
    if (turnoExistente) {
      fijarTurnoActualEnEstado(turnoExistente, null);
      navigation.navigate('Turno');
    } else {
      fijarSubtitulo('Seleccione una categoría por favor.');
      fijarPantallaActual(pantalla.centroAtencionFila);
    }
  }

  function pedirTurnoAgendado() {
    if (turnoAgendadoExistente) {
      fijarTurnoActualEnEstado(turnoAgendadoExistente, null);
      navigation.navigate('TurnoAgendado');
    } else {
      fijarSubtitulo('Seleccione una categoría por favor.');
      fijarPantallaActual(pantalla.centroAtencionTurno);
    }
  }

  function elegirTipoTurno() {
    fijarSubtitulo('¿Qué tipo de turno desea solicitar?');
    fijarPantallaActual(pantalla.tipoTurno);
  }

  function elegirFechaTurno(categoria) {
    fijarSubtitulo('Seleccione fecha y horario del turno');
    fijarCategoriaSeleccionada(categoria);
    fijarPantallaActual(pantalla.calendarioTurno);
  }

  useEffect(() => {
    function fijarPantallaInicial() {
    // centro.service: 0 = fila, 1 = agendado, 2 = ambos // HACER
      const tipoServicio = 2;
      switch (tipoServicio) {
        case 0:
          pedirTurnoFila();
          break;
        case 1:
          pedirTurnoAgendado();
          break;
        default:
          elegirTipoTurno();
      }
    }

    fijarPantallaInicial();
  }, []);

  function obtenerVista() {
    switch (pantallaActual) {
      case pantalla.centroAtencionFila:
        return (
          <CentroAtencion
            centro={centro}
            tipoTurno={tipoTurno.fila}
            navigation={navigation}
            elegirTipoTurno={elegirTipoTurno}
            elegirFechaTurno={elegirFechaTurno}
            fijarSubtitulo={fijarSubtitulo}
          />
        );
      case pantalla.centroAtencionTurno:
        return (
          <CentroAtencion
            centro={centro}
            tipoTurno={tipoTurno.agendado}
            navigation={navigation}
            elegirTipoTurno={elegirTipoTurno}
            elegirFechaTurno={elegirFechaTurno}
          />
        );
      case pantalla.calendarioTurno:
        return (
          <Calendario
            centro={centro}
            elegirTipoTurno={elegirTipoTurno}
            categoria={categoriaSeleccionada}
            navigation={navigation}
          />
        );
      default:
        return (
          <TipoTurno
            pedirTurnoFila={pedirTurnoFila}
            pedirTurnoAgendado={pedirTurnoAgendado}
          />
        );
    }
  }

  // para subtitulo (no mostrar cuando haya turno pedido - pantalla de confirmación)

  return (
    <View style={estilos.contenedor}>
      <Animated.View
        style={{
          ...estilos.contenedorEncabezado,
          height: pantallaActual !== pantalla.calendarioTurno
            ? altoContenedorCentro
            : altoContenedorCentroChico,
        }}
      >
        <View style={estilos.subcontenedor}>
          <Image style={estilos.imagenLogoCentro} source={IconosCentros[centro.app_icon]} />
          <Text
            multiline
            style={{
              ...estilosGlobales.subtituloGrande,
              ...estilos.subtituloCentro
            }}
          >
            {centro?.name}
          </Text>
        </View>
        <Text style={[estilosGlobales.textoAviso, estilos.explicacion]}>
          {subtitulo}
        </Text>
      </Animated.View>
      {obtenerVista()}
    </View>
  );
};

export default CentroContenedor;
