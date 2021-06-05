// @flow
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Alert, } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from '../entidades/usuario/login';
import CentroContenedor from '../entidades/centroAtencion/centroContenedor';
import Turno from '../entidades/turno/turno';
import TurnoAgendado from '../entidades/turnoAgendado/turnoAgendado';
import Registro from '../entidades/usuario/registro';
import Lobby from '../entidades/usuario/lobby';
import EvaluacionTurno from '../entidades/turno/evaluacionTurno';
import MenuLateral from './menuLateral';
import { ContextoEstilosGlobales } from '../lib/contextoEstilosGlobales';
import { ContextoIdiomas } from '../lib/contextoIdioma';
import { ContextoEstados } from '../lib/contextoEstados';
import { recuperarDatosLocalmente, recuperarTokenFB, procesarMensajeError } from '../lib/ayudante';
import PantallaCargando from './pantallaCargando';
import {
  BotonMenuHamburguesa, BotonRefrescarTurno, BotonBusqueda, BotonRefrescarTurnoAgendado
} from './botonesNavegador';
import { ContextoDialogoEmergente } from '../lib/contextoDialogoEmergente';

const Stack = createStackNavigator();

const NavegadorEvaluacion = (estilosGlobales: Object) => {
  const estilos = StyleSheet.create({
    encabezadoNavegacion: {
      backgroundColor: estilosGlobales.colorBarraNavegacion
    }
  });
  const { textosGlobales } = useContext(ContextoIdiomas);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="EvaluacionTurno"
          component={EvaluacionTurno}
          options={{
            headerLeft: () => null,
            title: textosGlobales.navegadorEvaluacion,
            headerStyle: estilos.encabezadoNavegacion,
            headerTintColor: estilosGlobales.colorLetraEncabezado,
            transitionSpec: {
              open: TransitionSpecs.TransitionIOSSpec,
              close: TransitionSpecs.TransitionIOSSpec,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const NavegadorFijoNoAutenticado = (estilosGlobales: Object) => {
  const estilos = StyleSheet.create({
    encabezadoNavegacion: {
      backgroundColor: estilosGlobales.colorBarraNavegacion
    }
  });
  const { textosGlobales } = useContext(ContextoIdiomas);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: textosGlobales.navegadorNombreApp,
            headerStyle: estilos.encabezadoNavegacion,
            headerTintColor: estilosGlobales.colorLetraEncabezado
          }}
          gestureEnabled={false}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{
            title: textosGlobales.navegadorRegistro,
            headerStyle: estilos.encabezadoNavegacion,
            headerTintColor: estilosGlobales.colorLetraEncabezado
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const NavegadorFijoAutenticado = ({ navigation, route }) => {
  const { estilosGlobales } = route.params;
  const [buscarCentro, cambiarBuscarCentro] = useState(false);
  const estilos = StyleSheet.create({
    encabezadoNavegacion: {
      backgroundColor: estilosGlobales.colorBarraNavegacion,
    }
  });
  const { textosGlobales } = useContext(ContextoIdiomas);

  return (
    <Stack.Navigator
      initialRouteName="Lobby"
    >
      <Stack.Screen
        name="Lobby"
        component={Lobby}
        options={{
          title: textosGlobales.navegadorLobby,
          headerStyle: {
            ...estilos.encabezadoNavegacion,
            elevation: 0, // Quitar la sombra de la barra de navegación
            shadowOpacity: 0 // Quitar la sombra de la barra de navegación
          },
          headerTintColor: estilosGlobales.colorLetraEncabezado,
          headerLeft: () => <BotonMenuHamburguesa navigation={navigation} />,
          headerRight: () => (
            <BotonBusqueda
              buscar={buscarCentro}
              cambiarBuscar={cambiarBuscarCentro}
            />
          )
        }}
      />
      <Stack.Screen
        name="CentroAtencion"
        component={CentroContenedor}
        options={{
          title: textosGlobales.navegadorCentro,
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: estilosGlobales.colorLetraEncabezado
        }}
      />
      <Stack.Screen
        name="Turno"
        component={Turno}
        options={{
          title: textosGlobales.navegadorTurno,
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: estilosGlobales.colorLetraEncabezado,
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
          headerRight: () => <BotonRefrescarTurno navigation={navigation} />
        }}
      />
      <Stack.Screen
        name="TurnoAgendado"
        component={TurnoAgendado}
        options={{
          title: textosGlobales.navegadorTurnoAgendado,
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: estilosGlobales.colorLetraEncabezado,
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
          headerRight: () => <BotonRefrescarTurnoAgendado navigation={navigation} />
        }}
      />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const NavegadorAutenticado = (estilosGlobales: Object, estadoDialogoEmergente: Object) => {
  const showDrawer = false;

  return (
    <NavigationContainer>
      <Drawer.Navigator
        // Deshabilitado cuando hay diálogo emergente.
        edgeWidth={!estadoDialogoEmergente ? 30 : 0}
        minSwipeDistance={10}
        drawerContent={(props) => <MenuLateral navigation={props.navigation} />}
        drawerType="front"
        drawerStyle={{ width: !showDrawer ? null : '100%' }}
      >
        <Drawer.Screen name="NavegadorFijo" component={NavegadorFijoAutenticado} initialParams={{ estilosGlobales }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const recuperarCredencialesAlmacenadas = async (
  fijarUsuarioLogueadoEnEstado: Function,
  asignarEstadoIdiomaUsuario: Function,
) => {
  try {
    const email = await recuperarDatosLocalmente('@email');
    const token = await recuperarDatosLocalmente('@token');
    const temaUsuario = await recuperarDatosLocalmente('@temaUsuario');
    const idiomaUsuario = await recuperarDatosLocalmente('@idiomaUsuario');
    let fbtoken = '';
    if (email) {
      fbtoken = await recuperarTokenFB();
      fijarUsuarioLogueadoEnEstado(email, token, fbtoken, temaUsuario, idiomaUsuario);
    } else if (idiomaUsuario) {
      asignarEstadoIdiomaUsuario(idiomaUsuario);
    }
    return token || '';
  } catch (error) {
    Alert.alert(procesarMensajeError(error.message, 'Error durante el recupero de sus datos.'));
  }
  return '';
};

export default () => {
  const {
    estadoLogin,
    estadoIrEvaluacion,
    estadoTurnosParaEvaluar,
    fijarUsuarioLogueadoEnEstado,
    asignarEstadoIdiomaUsuario,
  } = useContext(ContextoEstados);
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { estadoDialogoEmergente } = useContext(ContextoDialogoEmergente);
  const [listo, cambiarListo] = useState(false);

  // Recuperar credenciales almacenadas localmente
  useEffect(() => {
    const recuperarCredenciales = async () => {
      await recuperarCredencialesAlmacenadas(
        fijarUsuarioLogueadoEnEstado,
        asignarEstadoIdiomaUsuario
      );
      cambiarListo(true);
    };
    recuperarCredenciales();
  }, []);

  if (!listo) {
    return <PantallaCargando />;
  }

  if (estadoTurnosParaEvaluar?.length > 0 || estadoIrEvaluacion) {
    return NavegadorEvaluacion(estilosGlobales);
  }
  if ((estadoLogin?.email && estadoLogin?.token)) {
    return NavegadorAutenticado(estilosGlobales, estadoDialogoEmergente);
  }
  return NavegadorFijoNoAutenticado(estilosGlobales);
};
