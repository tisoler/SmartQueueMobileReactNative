// @flow
import * as React from 'react';
import { useState } from 'react';
import {
  View, TouchableWithoutFeedback, Animated, Easing, Platform
} from 'react-native';

type Props = {
  width: number | string,
  height: number,
  colorBoton: string,
  borderRadius?: number,
  ManejadorClick?: Function,
  colorEfecto?: string,
  estilo?: Object,
  children: React.Element<any> | React.Element<any>[],
  maxOpacity?: number,
  amplitudEfecto?: number
};

const BotonRipple = (props: Props) => {
  const {
    width,
    height,
    colorBoton,
    borderRadius = 0,
    ManejadorClick = () => {},
    colorEfecto = '#fff',
    estilo = {},
    children,
    maxOpacity = 0.2,
    amplitudEfecto = 1
  } = props;

  const [scaleValue] = useState(new Animated.Value(0.01));
  const [opacityValue] = useState(new Animated.Value(maxOpacity));
  const widthContainer = width;
  const heightContainer = height;

  const onPressed = () => {
    Animated.timing(scaleValue, {
      toValue: amplitudEfecto,
      duration: 120,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
      useNativeDriver: Platform.OS === 'android',
    }).start(() => {
      setTimeout(() => {
        scaleValue.setValue(0.01);
        opacityValue.setValue(maxOpacity);
      }, 150);
      setTimeout(() => ManejadorClick(), 350);
    });
  };

  const renderRippleView = () => (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: heightContainer,
        borderRadius,
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
        backgroundColor: colorEfecto,
        zIndex: 1
      }}
    />
  );

  const iconContainer = {
    width: widthContainer,
    height: heightContainer,
    backgroundColor: colorBoton,
    borderRadius
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPressed}
    >
      <View style={[iconContainer, estilo]}>
        {renderRippleView()}
        <View>
          {children}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

BotonRipple.defaultProps = {
  borderRadius: 0,
  ManejadorClick: () => {},
  colorEfecto: '#fff',
  estilo: {},
  maxOpacity: 0.2,
  amplitudEfecto: 1
};

export default BotonRipple;
