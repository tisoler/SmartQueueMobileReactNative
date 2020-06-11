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
  const { estadoLogin, fijarUsuarioLogueadoEnEstado } = useContext(ContextoEstados);
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
      marginBottom: 10
    },
    letraAvatar: {
      fontSize: 60,
      color: estilosGlobales.colorLetraEncabezado
    },
    opcionMenu: {
      flex: 0.15,
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: 5
    }
  });

  const nombreUsuario = estadoLogin?.nombre && estadoLogin?.apellido
    ? `${estadoLogin?.nombre} ${estadoLogin?.apellido}`
    : 'Mi Perfil';

  return (
    <View style={estilos.contenedorGlobal}>
      <View style={estilos.encabezadoPantallaConfirmar}>
        <View style={estilos.contenedorFotografia}>
          <Text style={estilos.letraAvatar}>X</Text>
        </View>
        <View style={{ width: '90%' }}>
          <Etiqueta value={nombreUsuario} icono={NombresIconosGenerales.usuario} />
        </View>
      </View>
      <TouchableOpacity style={estilos.opcionMenu} onPress={() => navigation.navigate('Lobby')}>
        <Etiqueta value="Mis turnos" icono={NombresIconosGenerales.turnos} tamanoLetra={18} />
      </TouchableOpacity>
      <TouchableOpacity
        style={estilos.opcionMenu}
        onPress={
          () => {
            fijarUsuarioLogueadoEnEstado('', '', '');
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
