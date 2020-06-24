// @flow
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';
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
import {
  recuperarDatosLocalmente,
  recuperarTokenFB,
  procesarMensajeError,
  esTokenValido
} from '../lib/ayudante';
import IconosGenerales from '../lib/iconos';
import { NombresIconosGenerales } from '../lib/constantes';
import { obtenerTicket } from '../lib/servicios';
import PantallaCargando from './pantallaCargando';

const Stack = createStackNavigator();

const BotonMenuHamburguesa = (props) => {
  const { estilos, navigation } = props;
  return (
    <View style={estilos.contenedorBotonHamburguesa}>
      <TouchableOpacity style={estilos.botonEnHeader} onPress={() => navigation.openDrawer()}>
        {IconosGenerales[NombresIconosGenerales.menu]}
      </TouchableOpacity>
    </View>
  );
};

const BotonRefrescarTurnos = (props) => {
  const {
    estadoTurnoActual,
    estadoLogin,
    estadoFbToken,
    estadoTemaUsuario,
    fijarTurnoActualEnEstado,
    fijarUsuarioLogueadoEnEstado
  } = useContext(ContextoEstados);
  const { turno } = estadoTurnoActual;
  const { estilos } = props;
  const [consultando, cambiarConsultando] = useState(false);
  const [haConsultado, cambiarHaConsultado] = useState(false);
  const refrescarTurnos = () => {
    if (turno && !haConsultado) {
      cambiarHaConsultado(true);
      setTimeout(() => {
        cambiarHaConsultado(false);
      }, 30000);
      cambiarConsultando(true);
      obtenerTicket(estadoLogin.token, turno?.Center?.id)
        .then(res => res.json())
        .then(respuesta => {
          fijarTurnoActualEnEstado(respuesta?.response?.ticket, respuesta?.response?.wait, true);
        })
        .catch((error) => {
          if (esTokenValido(
            error?.message,
            fijarUsuarioLogueadoEnEstado,
            estadoLogin.email,
            estadoFbToken,
            estadoTemaUsuario
          )) {
            Alert.alert(procesarMensajeError(error.message, 'Error al refrescar la información.'));
          }
        })
        .finally(() => cambiarConsultando(false));
    } else {
      Alert.alert('Debe esperar 30 segundos entre consultas.');
    }
  };
  return (
    <View style={estilos.contenedorBotonRefrescar}>
      { !consultando ? (
        <TouchableOpacity style={estilos.botonEnHeader} onPress={refrescarTurnos}>
          {IconosGenerales[NombresIconosGenerales.refrescar]}
        </TouchableOpacity>
      ) : (
        <ActivityIndicator size="small" color="#FFF" />
      )}
    </View>
  );
};

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
  const { estilosGlobales } = route.params;
  const estilos = StyleSheet.create({
    encabezadoNavegacion: {
      backgroundColor: estilosGlobales.colorBarraNavegacion
    },
    contenedorBotonHamburguesa: {
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 6,
      width: 50
    },
    botonEnHeader: {
      width: 50,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    contenedorBotonRefrescar: {
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 6,
      width: 50
    }
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Lobby"
        component={Lobby}
        options={{
          title: 'Queue',
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: estilosGlobales.colorLetraEncabezado,
          headerLeft: () => <BotonMenuHamburguesa navigation={navigation} estilos={estilos} />,
        }}
      />
      <Stack.Screen
        name="ListaCentrosAtencion"
        component={ListaCentrosAtencion}
        options={{
          title: 'Centros de atención',
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: estilosGlobales.colorLetraEncabezado
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
          headerRight: () => (
            <BotonRefrescarTurnos estilos={estilos} />
          )
        }}
      />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const NavegadorAutenticado = (estilosGlobales: Object) => (
  <NavigationContainer>
    <Drawer.Navigator
      edgeWidth={Math.round(Dimensions.get('window').width)}
      minSwipeDistance={5}
      drawerContent={(props) => <MenuLateral navigation={props.navigation} />}
    >
      <Drawer.Screen name="NavegadorFijo" component={NavegadorFijoAutenticado} initialParams={{ estilosGlobales }} />
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
    return NavegadorAutenticado(estilosGlobales);
  }
  return NavegadorFijoNoAutenticado(estilosGlobales);
};
