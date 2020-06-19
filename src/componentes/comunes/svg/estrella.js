// @flow
import * as React from 'react';
import { Svg, Path } from 'react-native-svg';
import { TouchableWithoutFeedback } from 'react-native';

type Props = {
  width?: number,
  height?: number,
  rellenar?: boolean,
  ManejadorClick?: Function
}

export default (props: Props) => {
  const {
    height = 60, width = 60, rellenar = false, ManejadorClick = () => {}
  } = props;

  const estilo = {
    width,
    height,
    stroke: 'yellow',
    strokeWidth: 0.5,
    fill: 'yellow',
    fillOpacity: rellenar ? 1 : 0,
    marginRight: 2,
    marginLeft: 2
  };

  return (
    <TouchableWithoutFeedback
      onPress={ManejadorClick}
    >
      <Svg style={estilo} viewBox="-1 -1 20 20">
        <Path d="M17.684,7.925l-5.131-0.67L10.329,2.57c-0.131-0.275-0.527-0.275-0.658,0L7.447,7.255l-5.131,0.67C2.014,7.964,1.892,8.333,2.113,8.54l3.76,3.568L4.924,17.21c-0.056,0.297,0.261,0.525,0.533,0.379L10,15.109l4.543,2.479c0.273,0.153,0.587-0.089,0.533-0.379l-0.949-5.103l3.76-3.568C18.108,8.333,17.986,7.964,17.684,7.925" />
      </Svg>
    </TouchableWithoutFeedback>
  );
};
