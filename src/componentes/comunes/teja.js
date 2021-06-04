// @flow
import * as React from 'react';
import { useState, } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Platform
} from 'react-native';
import { IconosCentros } from '../../lib/constantes';

type Props = {
  manejadorClick?: Function,
  appIcon: string,
  children: React.Element<any> | React.Element<any>[],
  height?: number,
  width?: number,
}

const Teja = (props: Props) => {
  const {
    manejadorClick = () => {},
    appIcon,
    children,
    height = 100,
    width = 270,
  } = props;

  const maxOpacity = 0.2;
  const [scaleValue] = useState(new Animated.Value(0.01));
  const [opacityValue] = useState(new Animated.Value(maxOpacity));

  const onPressed = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 120,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
      useNativeDriver: Platform.OS === 'android',
    }).start(() => {
      setTimeout(() => {
        scaleValue.setValue(0.01);
        opacityValue.setValue(maxOpacity);
      }, 150);
      setTimeout(() => manejadorClick(), 350);
    });
  };

  const renderRippleView = () => (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        borderRadius: 0,
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
        backgroundColor: '#013B4B',
        zIndex: 1
      }}
    />
  );

  const estilo = StyleSheet.create({
    teja: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.1,
      borderColor: '#686870',
      backgroundColor: '#ffffff',
      width,
      height,
      marginBottom: 10,
      zIndex: 1,
    },
    imagen: {
      marginLeft: 4,
      height,
      width: height,
    },
    lineaPuntos: {
      position: 'absolute',
      height,
      width: height + 10,
      borderColor: '#686870',
      borderWidth: 0.7,
      borderStyle: 'dashed',
      borderRadius: 1,
      top: -1,
      left: -1,
    }

  });

  return (
    <TouchableWithoutFeedback onPress={onPressed}>
      <View style={estilo.teja} elevation={5}>
        {renderRippleView()}
        <Image
          style={estilo.imagen}
          source={IconosCentros[appIcon] || IconosCentros['test_icon.png']}
        />
        <View style={estilo.lineaPuntos} />
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Teja;
