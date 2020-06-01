import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {FunctionResult, VariableResult} from '../DeviceModels';
import {useParticleAPI} from '../../../ParticleAPI';

export function ResetButton({id, accessToken}: any) {
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
            functionRequest('reset-device', '');
        }}>
        <Text style={{fontSize: 16, color: '#FFFFFF', textAlign: 'center'}}>
          RESET
        </Text>
      </TouchableOpacity>
    </View>
  );
}