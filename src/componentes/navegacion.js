// @flow
import React from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import Login from '../entidades/usuario/login';
import ListaCentrosAtencion from '../entidades/centroAtencion/listaCentrosAtencion';
import CentroAtencion from '../entidades/centroAtencion/centroAtencion';
import Turno from '../entidades/turno/turno';
import Registro from '../entidades/usuario/registro';
import Lobby from '../entidades/usuario/lobby';
import EvaluacionTurno from '../entidades/turno/evaluacionTurno';

const Stack = createStackNavigator();

const estilos = StyleSheet.create({
  encabezadoNavegacion: {
    backgroundColor: '#0A5164'
  }
});

const colorLetraEncabezado = '#fff';

const Navegacion = () => (
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
      <Stack.Screen
        name="Lobby"
        component={Lobby}
        options={{
          title: 'Smart queue',
          headerStyle: estilos.encabezadoNavegacion,
          headerTintColor: colorLetraEncabezado
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
  </NavigationContainer>
);

export default Navegacion;
