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
  Platform,
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
        top: -2,
        left: -2,
        width: 90,
        height: 90,
        borderRadius: 90,
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
        backgroundColor: estilosGlobales.colorFondoLogoLogin,
        zIndex: 1
      }}
    />
  );

  const estilo = StyleSheet.create({
    contenedor: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      width: 120,
    },
    imagen: {
      height: 75,
      width: 75,
    },
    teja: {
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#54B6E4',
      borderWidth: 2,
      borderRadius: 90,
      width: 90,
      height: 90,
    }
  });

  return (
    <TouchableWithoutFeedback onPress={onPressed}>
      <View style={estilo.contenedor}>
        <View style={estilo.teja}>
          {renderRippleView()}
          <Image
            style={estilo.imagen}
            source={IconosCentros[appIcon] || IconosCentros['test_icon.png']}
          />
        </View>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Teja;
