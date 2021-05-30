// @flow
import * as React from 'react';
import { useState, useContext } from 'react';
import {
  View, TouchableWithoutFeedback, Animated, Easing, Platform
} from 'react-native';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';

type Props = {
  width: number | string,
  height: number,
  colorFondo?: string,
  colorBorde?: string,
  borderRadius?: number,
  borderTopLeftRadius?: number,
  borderTopRightRadius?: number,
  borderBottomLeftRadius?: number,
  borderBottomRightRadius?: number,
  manejadorClick?: Function,
  colorEfecto?: string,
  estilo?: Object,
  children: React.Element<any> | React.Element<any>[],
  maxOpacity?: number,
  amplitudEfecto?: number,
  deshabilitado?: boolean,
  elevacion?: number,
};

const BotonRipple = (props: Props) => {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const {
    width,
    height,
    colorFondo = estilosGlobales.colorFondoBotonPrincipal,
    colorBorde = estilosGlobales.colorBordeBotonPrincipal,
    borderRadius = 10,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    manejadorClick = () => {},
    colorEfecto = estilosGlobales.colorEfectoClickBotonPrincipal,
    estilo = {},
    children,
    maxOpacity = 0.2,
    amplitudEfecto = 1,
    deshabilitado = false,
    elevacion = 0,
  } = props;

  const [scaleValue] = useState(new Animated.Value(0.01));
  const [opacityValue] = useState(new Animated.Value(maxOpacity));
  const [presiono, setPresiono] = useState(false);
  const widthContainer = width;
  const heightContainer = height;

  const onPressed = () => {
    setPresiono(true);
    Animated.timing(scaleValue, {
      toValue: amplitudEfecto,
      duration: 120,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
      useNativeDriver: Platform.OS === 'android',
    }).start(() => {
      setTimeout(() => {
        scaleValue.setValue(0.01);
        opacityValue.setValue(maxOpacity);
        setPresiono(false);
      }, 10);
      setTimeout(() => manejadorClick(), 50);
    });
  };

  const renderRippleView = () => (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: heightContainer - 3,
        borderRadius,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
        backgroundColor: colorEfecto,
        zIndex: 1
      }}
    />
  );

  const estiloContenedor = {
    width: widthContainer,
    height: heightContainer,
    borderWidth: 1.7,
    borderColor: !presiono ? colorBorde : estilosGlobales.colorFondoGlobal,
    backgroundColor: colorFondo ?? 'none',
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPressed}
      disabled={deshabilitado}
    >
      <View style={[estiloContenedor, estilo]} elevation={elevacion}>
        {renderRippleView()}
        <View>
          {children}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default BotonRipple;
