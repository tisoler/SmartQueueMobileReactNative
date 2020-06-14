// @flow
import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { ContextoEstados } from '../lib/contextoEstados';
import { ContextoEstilosGlobales } from '../lib/contextoEstilosGlobales';
import Etiqueta from './comunes/etiqueta';
import { NombresIconosGenerales } from '../lib/constantes';

const MenuLateral = (props: Object) => {
  const { navigation } = props;
  const {
    estadoLogin,
    fijarUsuarioLogueadoEnEstado,
    cambiarTemaUsuarioEnEstado
  } = useContext(ContextoEstados);
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);

  const estilos = StyleSheet.create({
    contenedorGlobal: {
      flex: 1,
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
      padding: 10,
      marginBottom: 15
    },
    contenedorFotografia: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 120,
      width: 120,
      borderRadius: 100,
      backgroundColor: estilosGlobales.colorAvatarLetra,
      marginBottom: 10,
      paddingBottom: 4
    },
    letraAvatar: {
      fontSize: 55,
      color: estilosGlobales.colorLetraEncabezado,
      textAlign: 'center'
    },
    opcionMenu: {
      flex: 0.15,
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: 5
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
      <TouchableOpacity style={estilos.opcionMenu} onPress={() => navigation.navigate('Lobby')}>
        <Etiqueta value="Mis turnos" icono={NombresIconosGenerales.turnos} tamanoLetra={18} />
      </TouchableOpacity>
      <TouchableOpacity
        style={estilos.opcionMenu}
        onPress={() => cambiarTemaUsuarioEnEstado()}
      >
        <Etiqueta
          value={estadoLogin?.temaUsuario === 'temaClaro' ? 'Estilo oscuro' : 'Estilo claro'}
          icono={NombresIconosGenerales.paleta}
          tamanoLetra={18}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={estilos.opcionMenu}
        onPress={
          () => {
            fijarUsuarioLogueadoEnEstado('', '', '', estadoLogin.fbtoken, estadoLogin.temaUsuario);
            navigation.closeDrawer();
          }
        }
      >
        <Etiqueta value="Cerrar sesión" icono={NombresIconosGenerales.cerrarSesion} tamanoLetra={18} />
      </TouchableOpacity>
    </View>
  );
};

export default MenuLateral;
