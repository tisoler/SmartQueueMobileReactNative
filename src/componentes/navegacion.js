// @flow
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View, Text } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Login from '../entidades/usuario/login';
import ListaCentrosAtencion from '../entidades/centroAtencion/listaCentrosAtencion';
import CentroAtencion from '../entidades/centroAtencion/centroAtencion';
import Turno from '../entidades/turno/turno';
import Registro from '../entidades/usuario/registro';
import Lobby from '../entidades/usuario/lobby';
import EvaluacionTurno from '../entidades/turno/evaluacionTurno';
import MenuLateral from './menuLateral';
import { ContextoEstilosGlobales } from '../lib/contextoEstilosGlobales';
import { ContextoStates } from '../lib/contextoStates';
import { recuperarDatosLocalmente, setearUsuarioLogueado } from '../entidades/usuario/usuarioAcciones';
import { login } from '../lib/servicios';

const Stack = createStackNavigator();

const colorLetraEncabezado = '#fff';

const BotonMenuHamburguesa = (props) => {
  const { estilos, navigation } = props;
  return (
    <TouchableOpacity style={estilos.botonHamburguesa} onPress={() => navigation.openDrawer()}>
      <FontAwesomeIcon style={{ lineHeight: 70 }} size={30} fill="#fff" icon={faBars} />
    </TouchableOpacity>
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
            headerTintColor: colorLetraEncabezado
          }}
          gestureEnabled={false}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{
            title: 'Smart queue - Registro',
            headerStyle: estilos.encabezadoNavegacion,
            headerTintColor: colorLetraEncabezado
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
    botonHamburguesa: {
      justifyContent: 'center',
      paddingLeft: 5,
      paddingRight: 5,
      marginLeft: 10,
      height: '100%'
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
          headerTintColor: colorLetraEncabezado,
          headerLeft: () => <BotonMenuHamburguesa navigation={navigation} estilos={estilos} />
        }}
      />
      <Stack.Screen
        name="ListaCentrosAtencion"
        component={ListaCentrosAtencion}
        options={{
          title: 'Centros de atención',
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: colorLetraEncabezado
        }}
      />
      <Stack.Screen
        name="CentroAtencion"
        component={CentroAtencion}
        options={{
          title: 'Centro de atención',
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: colorLetraEncabezado
        }}
      />
      <Stack.Screen
        name="Turno"
        component={Turno}
        options={{
          title: 'Turno',
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: colorLetraEncabezado,
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
        }}
      />
      <Stack.Screen
        name="EvaluacionTurno"
        component={EvaluacionTurno}
        options={{
          title: 'Evaluación',
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: colorLetraEncabezado,
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
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
      disableGestures
    >
      <Drawer.Screen name="NavegadorFijo" component={NavegadorFijoAutenticado} />
    </Drawer.Navigator>
  </NavigationContainer>
);

const recuperarCredencialesAlmacenadas = async (loginDispatch) => {
  const [email, contrasena] = [await recuperarDatosLocalmente('@email'), await recuperarDatosLocalmente('@contraseña')];
  if (email && contrasena) {
    const payload = { email, password: contrasena };
    const res = await login(payload);
    const respuesta = await res.json();
    if (respuesta.success) {
      setearUsuarioLogueado(loginDispatch, email, respuesta.token, contrasena);
    }
  }
};

export default () => {
  const { loginState, loginDispatch } = useContext(ContextoStates);
  const [listo, cambiarListo] = useState(false);
  // Recuperar credenciales almacenadas localmente
  useEffect(() => {
    const recuperarCredenciales = async () => {
      await recuperarCredencialesAlmacenadas(loginDispatch);
      cambiarListo(true);
    };
    recuperarCredenciales();
  }, []);

  if (!listo) {
    return <View><Text>Cargando</Text></View>;
  }

  if (loginState?.email && loginState?.token) {
    return NavegadorAutenticado();
  }
  return NavegadorFijoNoAutenticado();
};
