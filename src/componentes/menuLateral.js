// @flow
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ContextoStates } from '../lib/contextoStates';
import { setearUsuarioLogueado } from '../entidades/usuario/usuarioAcciones';

const MenuLateral = (props: Object) => {
  const { navigation } = props;
  const { loginDispatch } = useContext(ContextoStates);

  return (
    <View>
      <TouchableOpacity style={{ height: 200 }} onPress={() => navigation.navigate('Lobby')}>
        <Text>Mis turnos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setearUsuarioLogueado(loginDispatch, '', '', '')}>
        <Text>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MenuLateral;
