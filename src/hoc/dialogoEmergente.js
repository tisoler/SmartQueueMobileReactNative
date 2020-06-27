// @flow
import React from 'react';
import { View, Text, Dimensions } from 'react-native';

export default () => (
  <View
    style={{height: Dimensions.get('window').height + 110, top: -100, zIndex: 999, backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center'}}>
    <View style={{height: '30%', opacity: 1, zIndex: 1002, width: '30%', backgroundColor: '#fff'}}>
      <Text>Hola</Text>
    </View>
  </View>
);
