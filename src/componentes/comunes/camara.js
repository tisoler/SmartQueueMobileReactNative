import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { NombresIconosGenerales } from '../../lib/constantes';
import IconosGenerales from '../../lib/iconos';

type Props = {
  aceptarFoto: Function
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  fotografia: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    width: '97%'
  },
  lente: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  captura: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    marginTop: 10
  },
  accionesFoto: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10
  }
});

export default (props: Props) => {
  const { guardarUriFoto, uriFoto, aceptarFoto } = props;
  const [camaraFrontal, cambiarTipoCamara] = useState(true);
  let camera;

  const tomarFoto = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      guardarUriFoto(data.uri);
    }
  };

  const cambiarCamara = async () => {
    if (camera) {
      cambiarTipoCamara(!camaraFrontal);
    }
  };

  return (
    <View style={estilos.contenedor}>
      { !uriFoto
        ? (
          <RNCamera
            ref={ref => {
              camera = ref;
            }}
            style={estilos.fotografia}
            type={camaraFrontal ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            mirrorImage={false}
            androidCameraPermissionOptions={{
              title: 'Solicitud de permiso',
              message: 'Necesitamos tu permiso para el uso de la cámara.',
              buttonPositive: 'Sí',
              buttonNegative: 'No',
            }}
          />
        )
        : (
          <View style={estilos.fotografia}>
            <Image
              source={{ uri: uriFoto, isStatic: true }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        )}

      <View style={estilos.lente}>
        { !uriFoto
          ? (
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <TouchableOpacity onPress={cambiarCamara} style={estilos.captura}>
                {IconosGenerales[NombresIconosGenerales.girarCamara]}
                <Text style={{ fontSize: 17, color: '#fff' }}>
                  {camaraFrontal ? 'Frontal' : 'Trasera'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={tomarFoto} style={estilos.captura}>
                {IconosGenerales[NombresIconosGenerales.camara]}
              </TouchableOpacity>
            </View>
          )
          : (
            <View style={estilos.accionesFoto}>
              <TouchableOpacity style={{ paddingRight: 30 }} onPress={() => guardarUriFoto(null)}>
                {IconosGenerales[NombresIconosGenerales.cancelar]}
              </TouchableOpacity>
              <TouchableOpacity style={{ paddingLeft: 30 }} onPress={aceptarFoto}>
                {IconosGenerales[NombresIconosGenerales.aceptar]}
              </TouchableOpacity>
            </View>
          )}
      </View>
    </View>
  );
};
