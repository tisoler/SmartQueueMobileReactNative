// @flow
import React, { useContext } from 'react';
import {
  View, Dimensions, Text, StyleSheet
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import BotonPopup from '../componentes/comunes/botonPopup';
import { ContextoEstilosGlobales } from '../lib/contextoEstilosGlobales';
import { ContextoDialogoEmergente } from '../lib/contextoDialogoEmergente';

export default () => {
  const { estadoDialogoEmergente } = useContext(ContextoDialogoEmergente);
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const estilos = StyleSheet.create({
    contenedor: {
      position: 'absolute',
      zIndex: 3,
      top: -useHeaderHeight(),
      left: 0,
      right: 0,
      height: Dimensions.get('window').height + useHeaderHeight(),
      backgroundColor: 'rgba(0,0,0,0.7)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialogo: {
      flexDirection: 'column',
      zIndex: 6,
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '80%',
      height: '45%',
      backgroundColor: estilosGlobales.colorFondoGlobal
    },
    contenedorMensaje: {
      flex: 1,
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    contenedorTitulo: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: estilosGlobales.colorFondoEncabezadoTitulos,
      height: 60
    },
    contenedorCuerpo: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingLeft: 10,
      paddingRight: 10,
    },
    botonera: {
      flexDirection: 'row'
    }
  });

  if (estadoDialogoEmergente && estadoDialogoEmergente.botones?.length >= 2) {
    return (
      <View style={estilos.contenedor}>
        <View style={estilos.dialogo}>
          <View style={estilos.contenedorMensaje}>
            <View style={estilos.contenedorTitulo}>
              <Text style={estilosGlobales.tituloSeccionClaro}>
                {estadoDialogoEmergente.titulo || 'Notificación de turno'}
              </Text>
            </View>
            <View style={estilos.contenedorCuerpo}>
              <Text style={estilosGlobales.textoAviso}>
                {estadoDialogoEmergente.mensaje || '¿Qué desea hacer?'}
              </Text>
            </View>
          </View>
          <View style={estilos.botonera}>
            <BotonPopup
              height={80}
              width="50%"
              manejadorClick={estadoDialogoEmergente.botones[0].onPress}
              colorFondo={estilosGlobales.colorFondoBotonPrincipal}
            >
              { estadoDialogoEmergente.botones[0].texto }
            </BotonPopup>
            <BotonPopup
              height={80}
              width="50%"
              manejadorClick={estadoDialogoEmergente.botones[1].onPress}
              colorFondo="#8B6CC6"
            >
              { estadoDialogoEmergente.botones[1].texto }
            </BotonPopup>
          </View>
        </View>
      </View>
    );
  }

  return null;
};
