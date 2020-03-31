import React, { useState } from 'react';
import {
	View,
	TouchableWithoutFeedback,
	Animated,
	Easing,
	Platform
} from 'react-native';

const BotonRipple = (props) => {
		const {
			width,
			height,
			colorBoton,
			borderRadius = 0,
			ManejadorClick = () => {},
			colorEfecto = '#fff',
			estilo = {}
		} = props;

		const [maxOpacity] = useState(0.42);
		const [scaleValue] = useState(new Animated.Value(0.01));
		const [opacityValue] = useState(new Animated.Value(maxOpacity));
		const	widthContainer = width;
		const	heightContainer = height;

    const onPressedIn = () => {
			Animated.timing(scaleValue, {
				toValue: 1,
				duration: 120,
				easing: Easing.bezier(0.0, 0.0, 0.2, 1),
				useNativeDriver: Platform.OS === 'android',
			}).start(() => setTimeout(() => ManejadorClick(), 350));
    }

    const onPressedOut = () => {
			Animated.timing(opacityValue, {
				toValue: 0,
				useNativeDriver: Platform.OS === 'android',
			}).start(() => {
				scaleValue.setValue(0.01);
				opacityValue.setValue(maxOpacity);
			});
    }

    const renderRippleView = () => {
			return (
				<Animated.View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: heightContainer,
						borderRadius: borderRadius,
						transform: [{ scale: scaleValue }],
						opacity: opacityValue,
						backgroundColor: colorEfecto,
						zIndex: 1
					}}
				/>
			);
    }
    
    const iconContainer = { 
			width: widthContainer, 
			height: heightContainer, 
			backgroundColor: colorBoton,
			borderRadius: borderRadius
    };

    return (
			<TouchableWithoutFeedback
				onPressIn={onPressedIn}
				onPressOut={onPressedOut}
			>
				<View style={[iconContainer, estilo]}>
					{renderRippleView()}
					<View >
						{props.children}
					</View>
				</View>
			</TouchableWithoutFeedback>
    );
}

export default BotonRipple
