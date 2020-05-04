// @flow
import React from 'react';
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

const Navegacion = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: 'Smart queue',
          headerStyle: {
            backgroundColor: '#005f79'
          },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen
        name="Registro"
        component={Registro}
        options={{
          title: 'Smart queue - Registro',
          headerStyle: {
            backgroundColor: '#005f79'
          },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen
        name="Lobby"
        component={Lobby}
        options={{
          title: 'Smart queue',
          headerStyle: {
            backgroundColor: '#005f79'
          },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen
        name="ListaCentrosAtencion"
        component={ListaCentrosAtencion}
        options={{
          title: 'Centros de atención',
          headerStyle: {
            backgroundColor: '#005f79'
          },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen
        name="CentroAtencion"
        component={CentroAtencion}
        options={{
          title: 'Centro de atención',
          headerStyle: {
            backgroundColor: '#005f79'
          },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen
        name="Turno"
        component={Turno}
        options={{
          title: 'Turno',
          headerStyle: {
            backgroundColor: '#005f79'
          },
          headerTintColor: '#fff',
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
          headerStyle: {
            backgroundColor: '#005f79'
          },
          headerTintColor: '#fff',
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
