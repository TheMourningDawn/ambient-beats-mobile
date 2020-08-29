import {Picker} from '@react-native-community/picker';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Variable, VariableResult} from '../DeviceModels';
import { useParticleAPI } from '../../../ParticleAPI';

export function DeviceVariable({id, reformattedVariables, accessToken}: any) {
  const [selectedValue, setSelectedValue] = useState<string>('hue');
  const [variableValue, setVariableValue] = useState<string>('123%');

  const [{isLoading, isError}, functionRequest, variableRequest] = useParticleAPI(id, accessToken)

  function getVariableValue() {
    variableRequest(selectedValue).then((result: VariableResult) => {
      setVariableValue(result.result)
    });
  }

  const style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignContent: 'center',
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
      borderRadius: 6,
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
      width: 90,
      height: 25,
      backgroundColor: '#EF8354',
      borderRadius: 6,
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
          onValueChange={(itemValue) => setSelectedValue(itemValue.toString())}>
          {!!reformattedVariables && reformattedVariables.map((item: Variable, index: string) => {
            return (
              <Picker.Item label={item.name} value={item.name} key={index} />
            );
          })}
        </Picker>
        <View style={style.valueText}>
          <Text style={{fontSize: 18, color: '#FFFFFF', textAlign: 'center'}}>
            {variableValue}
          </Text>
        </View>
        <TouchableOpacity
          style={style.button}
          onPress={() => {
            getVariableValue();
          }}>
          <Text style={{fontSize: 16, color: '#FFFFFF', textAlign: 'center'}}>
            REFRESH
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
