import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useParticleAPI } from '../../../ParticleAPI';

export function SafeModeButton({id, accessToken}: any) {
  const [{}, functionRequest, variableRequest] = useParticleAPI(
    id,
    accessToken,
  );

  const style = StyleSheet.create({
    container: {
      flex: 1,
    },
    switch: {
      flex: 1,
    },
    text: {
      fontSize: 20,
      color: '#FFF',
    },
    button: {
      flex: 1,
      backgroundColor: '#EF8354',
      borderRadius: 10,
      height: 50,
      alignContent: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={style.container}>
      <TouchableOpacity
        style={style.button}
        onPress={() => {
            functionRequest('enter-safe-mode', '');
        }}>
        <Text style={{fontSize: 16, color: '#FFFFFF', textAlign: 'center'}}>
          SAFE MODE
        </Text>
      </TouchableOpacity>
    </View>
  );
}