// @flow
import * as React from 'react';
import { useState } from 'react';
import {
  View, TouchableWithoutFeedback, Animated, Easing, Platform
} from 'react-native';

type Props = {
  width: number | string,
  height: number,
  colorFondo?: string,
  colorBorde?: string,
  borderRadius?: number,
  manejadorClick?: Function,
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
    colorFondo,
    colorBorde = colorFondo,
    borderRadius = 10,
    manejadorClick = () => {},
    colorEfecto = 'black',
    estilo = {},
    children,
    maxOpacity = 0.2,
    amplitudEfecto = 1
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
        width: '100%',
        height: heightContainer - 3,
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
    borderWidth: 1.7,
    borderColor: !presiono ? colorBorde : '#016E8B',
    backgroundColor: colorFondo ?? 'none',
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
  borderRadius: 7,
  manejadorClick: () => {},
  colorEfecto: 'black',
  colorFondo: '#16817a',
  colorBorde: '#16817a',
  estilo: {},
  maxOpacity: 0.2,
  amplitudEfecto: 1
};

export default BotonRipple;
