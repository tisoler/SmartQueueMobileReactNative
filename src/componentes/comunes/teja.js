// @flow
import * as React from 'react';
import { useState } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Platform,
  Dimensions
} from 'react-native';
import { IconosCentros } from '../../lib/constantes';

const pantallaChica = Math.round(Dimensions.get('window')?.height) < 600;

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

  const maxOpacity = 0.2;
  const [scaleValue] = useState(new Animated.Value(0.01));
  const [opacityValue] = useState(new Animated.Value(maxOpacity));
  const height = pantallaChica ? 90 : 100;
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
      width: pantallaChica ? 90 : 100
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
          source={IconosCentros[appIcon]}
        />
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Teja;
