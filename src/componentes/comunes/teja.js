// @flow
import * as React from 'react';
import { useState, useContext } from 'react';
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
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';

type Props = {
  manejadorClick: Function,
  appIcon: string,
  children: React.Element<any> | React.Element<any>[],
}

const Teja = (props: Props) => {
  const {
    manejadorClick,
    appIcon,
    children
  } = props;
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);

  const maxOpacity = 0.2;
  const [scaleValue] = useState(new Animated.Value(0.01));
  const [opacityValue] = useState(new Animated.Value(maxOpacity));
  const height = estilosGlobales.tamañoLogoCentroTeja;
  const width = '100%';

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
    imagen: {
      height,
      width: estilosGlobales.tamañoLogoCentroTeja
    },
    teja: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 0.3,
      borderColor: '#2A4D57',
      width,
      height
    }
  });

  return (
    <TouchableWithoutFeedback onPress={onPressed}>
      <View style={estilo.teja}>
        {renderRippleView()}
        <Image
          style={estilo.imagen}
          source={IconosCentros[appIcon] || IconosCentros['test_icon.png']}
        />
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Teja;
