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
          title: 'TucapelTurnos',
          headerStyle: {
            backgroundColor: '#ffffff'
          },
          headerTintColor: '#bb0000'
        }}
      />
      <Stack.Screen
        name="Registro"
        component={Registro}
        options={{
          title: 'Tucapel - Solicitar TucapelID',
          headerStyle: {
            backgroundColor: '#fff'
          },
          headerTintColor: '#bb0000'
        }}
      />
      <Stack.Screen
        name="Lobby"
        component={Lobby}
        options={{
          title: 'Zina de Espera',
          headerStyle: {
            backgroundColor: '#fff'
          },
          headerTintColor: '#bb0000'
        }}
      />
      <Stack.Screen
        name="ListaCentrosAtencion"
        component={ListaCentrosAtencion}
        options={{
          title: 'Plantas y SUcursales',
          headerStyle: {
            backgroundColor: '#fff'
          },
          headerTintColor: '#bb0000'
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
