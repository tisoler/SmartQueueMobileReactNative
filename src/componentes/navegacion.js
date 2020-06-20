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
import { recuperarDatosLocalmente, recuperarTokenFB, recuperarMensajeError } from '../lib/ayudante';
import IconosGenerales from '../lib/iconos';
import { NombresIconosGenerales } from '../lib/constantes';
import { login, estimarDemora } from '../lib/servicios';
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
  const { estadoTurnoActual, estadoLogin, fijarTurnoActualEnEstado } = useContext(ContextoEstados);
  const { turno: turnoActual } = estadoTurnoActual;
  const { estilos } = props;
  const [consultando, cambiarConsultando] = useState(false);
  const [haConsultado, cambiarHaConsultado] = useState(false);
  const refrescarTurnos = () => {
    if (!haConsultado) {
      cambiarHaConsultado(true);
      setTimeout(() => {
        cambiarHaConsultado(false);
      }, 30000);
      cambiarConsultando(true);
      estimarDemora(estadoLogin.token, turnoActual?.Category?.id, turnoActual?.Center?.id)
        .then(res => res.json())
        .then(respuesta => {
          fijarTurnoActualEnEstado(turnoActual, respuesta?.response?.wait);
        })
        .catch((error) => Alert.alert(recuperarMensajeError(error.message, 'Error al consultar la demora prevista.')))
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

const NavegadorEvaluacion = () => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
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

const NavegadorFijoNoAutenticado = () => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
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
            title: 'Smart queue',
            headerStyle: estilos.encabezadoNavegacion,
            headerTintColor: estilosGlobales.colorLetraEncabezado
          }}
          gestureEnabled={false}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{
            title: 'Smart queue - Registro',
            headerStyle: estilos.encabezadoNavegacion,
            headerTintColor: estilosGlobales.colorLetraEncabezado
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const NavegadorFijoAutenticado = ({ navigation }) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
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
          title: 'Smart queue',
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

const NavegadorAutenticado = () => (
  <NavigationContainer>
    <Drawer.Navigator
      edgeWidth={Math.round(Dimensions.get('window').width)}
      minSwipeDistance={5}
      drawerContent={(props) => <MenuLateral navigation={props.navigation} />}
    >
      <Drawer.Screen name="NavegadorFijo" component={NavegadorFijoAutenticado} />
    </Drawer.Navigator>
  </NavigationContainer>
);

const recuperarCredencialesAlmacenadas = async (fijarUsuarioLogueadoEnEstado) => {
  try {
    const [email, contrasena, temaUsuario] = [await recuperarDatosLocalmente('@email'), await recuperarDatosLocalmente('@contraseña'), await recuperarDatosLocalmente('@temaUsuario')];
    if (email && contrasena) {
      const fbtoken = await recuperarTokenFB();
      const payload = { email, password: contrasena, fbtoken };
      const res = await login(payload);
      const respuesta = await res.json();
      if (respuesta.success) {
        fijarUsuarioLogueadoEnEstado(email, respuesta.token, contrasena, fbtoken, temaUsuario);
      }
    }
  } catch (error) {
    Alert.alert(recuperarMensajeError(error.message, 'Error durante el recupero de sus datos.'));
  }
};

export default () => {
  const {
    estadoLogin,
    estadoTurnosParaEvaluar,
    fijarUsuarioLogueadoEnEstado,
  } = useContext(ContextoEstados);

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

  if (estadoTurnosParaEvaluar?.length > 0) {
    return NavegadorEvaluacion();
  }
  if (estadoLogin?.email && estadoLogin?.token) {
    return NavegadorAutenticado();
  }
  return NavegadorFijoNoAutenticado();
};
