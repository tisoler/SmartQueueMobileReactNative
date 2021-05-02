// @flow
import React, { useContext, useState } from 'react';
import {
  TouchableOpacity, View, Alert, ActivityIndicator, TextInput, StyleSheet
} from 'react-native';
import { ContextoEstados } from '../lib/contextoEstados';
import IconosGenerales from '../lib/iconos';
import { NombresIconosGenerales } from '../lib/constantes';
import recuperarTicket from '../entidades/turno/llamadasServicioComunes';

const estilos = StyleSheet.create({
  contenedorBotonIzquierda: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    width: 50
  },
  contenedorBotonDerecha: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    width: 50
  },
  contenedorBusqueda: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 6,
    width: '100%',
    height: '100%'
  },
  textoBusqueda: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 2,
    marginBottom: 8,
    textAlign: 'left',
    fontSize: 20
  },
  botonEnHeader: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export const BotonMenuHamburguesa = (props: Object) => {
  const { navigation } = props;
  return (
    <View style={estilos.contenedorBotonIzquierda}>
      <TouchableOpacity style={estilos.botonEnHeader} onPress={() => navigation.openDrawer()}>
        {IconosGenerales[NombresIconosGenerales.menu]}
      </TouchableOpacity>
    </View>
  );
};

export const BotonRefrescarTurnos = (props: Object) => {
  const { navigation } = props;
  const {
    estadoLogin,
    estadoFbToken,
    estadoTurnoActual,
    estadoTemaUsuario,
    fijarTurnoActualEnEstado,
    fijarTurnosEnEstado,
    fijarUsuarioLogueadoEnEstado
  } = useContext(ContextoEstados);
  const { turno } = estadoTurnoActual;
  const [consultando, cambiarConsultando] = useState(false);
  const [haConsultado, cambiarHaConsultado] = useState(false);
  const refrescarTurnos = async () => {
    if (turno && !haConsultado) {
      cambiarHaConsultado(true);
      setTimeout(() => {
        cambiarHaConsultado(false);
      }, 30000);
      cambiarConsultando(true);
      await recuperarTicket(
        estadoLogin,
        estadoFbToken,
        estadoTurnoActual,
        estadoTemaUsuario,
        fijarTurnoActualEnEstado,
        fijarTurnosEnEstado,
        fijarUsuarioLogueadoEnEstado,
        navigation
      );
      cambiarConsultando(false);
    } else {
      Alert.alert('Debe esperar 30 segundos entre consultas.');
    }
  };
  return (
    <View style={estilos.contenedorBotonDerecha}>
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

export const BotonBusqueda = (props: Object) => {
  const { buscar, cambiarBuscar } = props;
  const { filtrarCentrosEnEstado } = useContext(ContextoEstados);
  return (
    <View style={estilos.contenedorBusqueda}>
      {buscar
        && (
        <TextInput
          style={estilos.textoBusqueda}
          onChangeText={texto => filtrarCentrosEnEstado(texto)}
          autoFocus
        />
        )}
      <TouchableOpacity
        style={estilos.botonEnHeader}
        onPress={() => {
          if (buscar) filtrarCentrosEnEstado('');
          cambiarBuscar(!buscar);
        }}
      >
        {IconosGenerales[buscar ? NombresIconosGenerales.cruz : NombresIconosGenerales.lupa]}
      </TouchableOpacity>
    </View>
  );
};
