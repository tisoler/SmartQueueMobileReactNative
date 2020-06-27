// @flow
import React, { useContext, useState } from 'react';
import {
  TouchableOpacity, View, Alert, ActivityIndicator, TextInput, StyleSheet
} from 'react-native';
import { ContextoEstados } from '../lib/contextoEstados';
import { procesarMensajeError, esTokenValido } from '../lib/ayudante';
import IconosGenerales from '../lib/iconos';
import { NombresIconosGenerales } from '../lib/constantes';
import { obtenerTicket } from '../lib/servicios';

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
    width: 200,
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

export const BotonRefrescarTurnos = () => {
  const {
    estadoTurnoActual,
    estadoLogin,
    estadoFbToken,
    estadoTemaUsuario,
    fijarTurnoActualEnEstado,
    fijarUsuarioLogueadoEnEstado
  } = useContext(ContextoEstados);
  const { turno } = estadoTurnoActual;
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
