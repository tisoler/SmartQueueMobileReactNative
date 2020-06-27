// @flow
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from '../entidades/usuario/login';
import ListaCentrosAtencion from '../entidades/centroAtencion/listaCentrosAtencion';
import CentroAtencion from '../entidades/centroAtencion/centroAtencion';
import Turno from '../entidades/turno/turno';
import Registro from '../entidades/usuario/registro';
import Lobby from '../entidades/usuario/lobby';
import EvaluacionTurno from '../entidades/turno/evaluacionTurno';
import MenuLateral from './menuLateral';
import { ContextoEstilosGlobales } from '../lib/contextoEstilosGlobales';
import { ContextoEstados } from '../lib/contextoEstados';
import { recuperarDatosLocalmente, recuperarTokenFB, procesarMensajeError } from '../lib/ayudante';
import PantallaCargando from './pantallaCargando';
import { BotonMenuHamburguesa, BotonRefrescarTurnos, BotonBusqueda } from './botonesHeader';

const Stack = createStackNavigator();

const NavegadorEvaluacion = (estilosGlobales: Object) => {
  const estilos = StyleSheet.create({
    encabezadoNavegacion: {
      backgroundColor: estilosGlobales.colorBarraNavegacion
    }
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="EvaluacionTurno"
          component={EvaluacionTurno}
          options={{
            headerLeft: () => null,
            title: 'Evaluación',
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

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Queue',
            headerStyle: estilos.encabezadoNavegacion,
            headerTintColor: estilosGlobales.colorLetraEncabezado
          }}
          gestureEnabled={false}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{
            title: 'Queue - Registro',
            headerStyle: estilos.encabezadoNavegacion,
            headerTintColor: estilosGlobales.colorLetraEncabezado
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const NavegadorFijoAutenticado = ({ navigation, route }) => {
  const { estilosGlobales, estadoTurnoActual } = route.params;
  const [buscarCentro, cambiarBuscarCentro] = useState(false);
  const estilos = StyleSheet.create({
    encabezadoNavegacion: {
      backgroundColor: estilosGlobales.colorBarraNavegacion
    }
  });

  return (
    <Stack.Navigator
      initialRouteName={estadoTurnoActual?.irHaciaTurno ? 'Turnos' : 'Lobby'}
    >
      <Stack.Screen
        name="Lobby"
        component={Lobby}
        options={{
          title: 'Queue',
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: estilosGlobales.colorLetraEncabezado,
          headerLeft: () => <BotonMenuHamburguesa navigation={navigation} />,
        }}
      />
      <Stack.Screen
        name="ListaCentrosAtencion"
        component={ListaCentrosAtencion}
        options={{
          title: !buscarCentro ? 'Centros de atención' : '',
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: estilosGlobales.colorLetraEncabezado,
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
        component={CentroAtencion}
        options={{
          title: 'Centro de atención',
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: estilosGlobales.colorLetraEncabezado
        }}
      />
      <Stack.Screen
        name="Turno"
        component={Turno}
        options={{
          title: 'Turno',
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: estilosGlobales.colorLetraEncabezado,
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
          headerRight: () => <BotonRefrescarTurnos />
        }}
      />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const NavegadorAutenticado = (estilosGlobales: Object, estadoTurnoActual: Object) => (
  <NavigationContainer>
    <Drawer.Navigator
      edgeWidth={Math.round(Dimensions.get('window').width)}
      minSwipeDistance={5}
      drawerContent={(props) => <MenuLateral navigation={props.navigation} />}
    >
      <Drawer.Screen name="NavegadorFijo" component={NavegadorFijoAutenticado} initialParams={{ estilosGlobales, estadoTurnoActual }} />
    </Drawer.Navigator>
  </NavigationContainer>
);

const recuperarCredencialesAlmacenadas = async (fijarUsuarioLogueadoEnEstado: Function) => {
  try {
    const email = await recuperarDatosLocalmente('@email');
    const token = await recuperarDatosLocalmente('@token');
    const temaUsuario = await recuperarDatosLocalmente('@temaUsuario');
    let fbtoken = '';
    if (email) {
      fbtoken = await recuperarTokenFB();
      fijarUsuarioLogueadoEnEstado(email, token, fbtoken, temaUsuario);
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
    estadoTurnosParaEvaluar,
    estadoIrEvaluacion,
    estadoTurnoActual,
    fijarUsuarioLogueadoEnEstado
  } = useContext(ContextoEstados);
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const [listo, cambiarListo] = useState(false);

  // Recuperar credenciales almacenadas localmente
  useEffect(() => {
    const recuperarCredenciales = async () => {
      await recuperarCredencialesAlmacenadas(fijarUsuarioLogueadoEnEstado);
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
    return NavegadorAutenticado(estilosGlobales, estadoTurnoActual);
  }
  return NavegadorFijoNoAutenticado(estilosGlobales);
};
