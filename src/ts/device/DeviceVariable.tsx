import React, { useState } from 'react';
import { Picker, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { VariableResult } from './Device';

export function DeviceVariable({id, reformattedVariables, accessToken}: any) {
  const [selectedValue, setSelectedValue] = useState('hue');
  const [variableValue, setVariableValue] = useState('123%');

  function getVariableValue() {
      console.info(`https://api.particle.io/v1/devices/${id}/${selectedValue}?access_token=${accessToken}`)
    fetch(
      `https://api.particle.io/v1/devices/${id}/${selectedValue}?access_token=${accessToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    )
      .then((response) => {
        console.info('GettingVarStatusCode: ' + response.status);
        return response.json();
      })
      .then((json) => {
        console.info(json)
        const jsonString = JSON.stringify(json, (key, value) => {
            if (typeof value === "boolean"||typeof value === "number") {
                return String(value);
              }
              return value;
        })

        const variableResult: VariableResult = JSON.parse(jsonString) as VariableResult;
        setVariableValue(variableResult.result)
        console.info(json);
      }).catch((error) => {
        console.error(error)
      });
  }

  const style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignContent: 'center',
      marginBottom: 20,
    },
    titleText: {
      flex: 1,
      fontSize: 22,
      color: '#FFFFFF',
      marginLeft: 4,
    },
    selectorContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#4F5D75',
      borderRadius: 20,
    },
    picker: {
      flex: 3,
      width: 30,
      color: '#FFFFFF',
      fontSize: 20,
      marginLeft: 10,
    },
    valueText: {
      flex: 1,
      color: '#FFFFFF',
      fontSize: 16,
    },
    button: {
      flex: 1,
      width: 100,
      height: 25,
      backgroundColor: '#EF8354',
      borderRadius: 10,
      alignContent: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={style.container}>
      <View>
        <Text style={style.titleText}>Get Variable Value</Text>
      </View>
      <View style={style.selectorContainer}>
        <Picker
          selectedValue={selectedValue}
          style={style.picker}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}>
          {reformattedVariables.map((item, index) => {
            return <Picker.Item label={item.name} value={item.name} key={index} />;
          })}
        </Picker>
        <View style={style.valueText}>
          <Text style={{fontSize: 18, color: '#FFFFFF', textAlign: 'center'}}>
            {variableValue}
          </Text>
        </View>
        <TouchableOpacity style={style.button} onPress={() => {getVariableValue()}}>
          <Text style={{fontSize: 16, color: '#FFFFFF', textAlign: 'center'}}>
            REFRESH
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
