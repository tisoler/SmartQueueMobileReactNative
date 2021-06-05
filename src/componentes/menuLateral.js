// @flow
import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ContextoEstados } from '../lib/contextoEstados';
import { ContextoEstilosGlobales } from '../lib/contextoEstilosGlobales';
import { ContextoIdiomas } from '../lib/contextoIdioma';
import Etiqueta from './comunes/etiqueta';
import { NombresIconosGenerales } from '../lib/constantes';
import { version } from '../../package.json';

const MenuLateral = (props: Object) => {
  const { navigation } = props;
  const {
    estadoLogin,
    estadoTemaUsuario,
    estadoIdiomaUsuario,
    estadoFbToken,
    fijarUsuarioLogueadoEnEstado,
    cambiarTemaUsuarioEnEstado,
    cambiarIdiomaUsuarioEnEstado,
  } = useContext(ContextoEstados);
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { textosGlobales } = useContext(ContextoIdiomas);

  const estilos = StyleSheet.create({
    contenedorGlobal: {
      flex: 1,
      width: Math.round(Dimensions.get('window')?.width || 300) * 0.85,
      flexDirection: 'column',
      backgroundColor: estilosGlobales.colorBarraNavegacion
    },
    encabezadoPantallaConfirmar: {
      flex: 0.33,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: estilosGlobales.colorFondoGlobal,
      padding: 10
    },
    contenedorFotografia: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 120,
      width: 120,
      borderRadius: 100,
      backgroundColor: estilosGlobales.colorAvatarLetra,
      paddingBottom: 4,
      marginBottom: 10
    },
    letraAvatar: {
      fontSize: 55,
      color: estilosGlobales.colorLetraEncabezado,
      textAlign: 'center'
    },
    opcionMenu: {
      justifyContent: 'center',
      height: 80,
      paddingLeft: 5
    },
    contenedorOpciones: {
      flex: 0.66
    },
    contenedorCerrarSesion: {
      flex: 1,
      justifyContent: 'flex-end'
    },
    version: {
      height: 20,
      textAlign: 'right',
      justifyContent: 'center',
      paddingRight: 10,
      color: estilosGlobales.colorVersion
    }
  });

  const nombreUsuario = estadoLogin?.nombre?.trim() ? estadoLogin.nombre : 'Mi Perfil';

  return (
    <View style={estilos.contenedorGlobal}>
      <View style={estilos.encabezadoPantallaConfirmar}>
        <View style={estilos.contenedorFotografia}>
          <Text style={estilos.letraAvatar}>{estadoLogin.iniciales}</Text>
        </View>
        <View style={{ width: '90%' }}>
          <Etiqueta value={nombreUsuario} icono={NombresIconosGenerales.usuario} tamanoLetra={18} />
        </View>
      </View>
      <View style={estilos.contenedorOpciones}>
        <TouchableOpacity style={estilos.opcionMenu} onPress={() => navigation.navigate('Lobby')}>
          <Etiqueta
            value={textosGlobales.menuLateralMisTurnos}
            icono={NombresIconosGenerales.turnos}
            tamanoLetra={18}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={estilos.opcionMenu}
          onPress={() => cambiarIdiomaUsuarioEnEstado()}
        >
          <Etiqueta
            value={estadoIdiomaUsuario === 'espaniol' ? 'Change to English' : 'Cambiar a español'}
            icono={NombresIconosGenerales.idioma}
            tamanoLetra={18}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={estilos.opcionMenu}
          onPress={() => cambiarTemaUsuarioEnEstado()}
        >
          <Etiqueta
            value={estadoTemaUsuario === 'temaClaro' ? textosGlobales.menuLateralEstiloClaro : textosGlobales.menuLateralEstiloOscuro}
            icono={NombresIconosGenerales.paleta}
            tamanoLetra={18}
          />
        </TouchableOpacity>
        <View style={estilos.contenedorCerrarSesion}>
          <TouchableOpacity
            style={estilos.opcionMenu}
            onPress={
              () => {
                fijarUsuarioLogueadoEnEstado('', '', estadoFbToken, estadoTemaUsuario, estadoIdiomaUsuario);
                navigation.closeDrawer();
              }
            }
          >
            <Etiqueta
              value={textosGlobales.menuLateralCerrarSesion}
              icono={NombresIconosGenerales.cerrarSesion}
              tamanoLetra={18}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={estilos.version}>{`v${version}`}</Text>
    </View>
  );
};

export default MenuLateral;
