import { Picker } from '@react-native-community/picker';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useParticleAPI } from '../../../ParticleAPI';
import { FunctionResult } from '../DeviceModels';

export function DeviceFunction({id, functions, accessToken}: any) {
  const [selectedFunction, setSelectedFunction] = useState<string>('hue');
  const [functionInputValue, setFunctionInputValue] = useState<string>('');
  const [functionReturnCode, setFunctionReturnCode] = useState<number>();
  const [{isLoading, isError}, functionRequest] = useParticleAPI(id, accessToken)

  function runFunctionWithInput() {
    functionRequest(selectedFunction, functionInputValue).then((result: FunctionResult) => {
      setFunctionReturnCode(result.return_value)
    });
  }

  const style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    titleText: {
      flex: 1,
      fontSize: 22,
      color: '#FFFFFF',
      marginLeft: 4,
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#4F5D75',
      borderRadius: 10,
    },
    controlsContainer: {
      flex: 3,
      flexDirection: 'column',
      marginRight: 8,
      marginLeft: 8,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 'auto',
      justifyContent: 'flex-end',
    },
    selectorContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    picker: {
      flex: 3,
      color: '#FFFFFF',
      fontSize: 20,
    },
    valueText: {
      flex: 1,
      color: '#FFFFFF',
      fontSize: 16,
    },
    functionInputContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    textInput: {
      backgroundColor: '#BFC0C0',
      borderRadius: 10,
      width: '100%',
    },
    button: {
      flex: 1,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 'auto',
      width: 90,
      backgroundColor: '#EF8354',
      borderRadius: 10,
      alignContent: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
    },
  });

  return (
    <View style={style.container}>
      <View>
        <Text style={style.titleText}>Trigger Function</Text>
      </View>
      <View style={style.contentContainer}>
        <View style={style.controlsContainer}>
          <View style={style.selectorContainer}>
            {!!functions ? (
              <Picker
                selectedValue={selectedFunction}
                style={style.picker}
                onValueChange={(itemValue) =>
                  setSelectedFunction(itemValue.toString())
                }>
                {functions.map((item: string, index: string) => {
                  return <Picker.Item label={item} value={item} key={index} />;
                })}
              </Picker>
            ) : (
              <Text style={{marginLeft: 4}}>No functions available</Text>
            )}
            <View style={style.valueText}>
              <Text
                style={{fontSize: 18, color: '#FFFFFF', textAlign: 'center'}}>
                {functionReturnCode}
              </Text>
            </View>
          </View>
          <View style={style.functionInputContainer}>
            <TextInput
              style={style.textInput}
              placeholder="function argument"
              onChangeText={(text) => {
                setFunctionInputValue(text);
              }}
              value={functionInputValue}
            />
          </View>
        </View>
        <View style={style.buttonContainer}>
          <TouchableOpacity
            style={style.button}
            onPress={() => {
              runFunctionWithInput();
            }}>
            <Text style={{fontSize: 16, color: '#FFFFFF', textAlign: 'center'}}>
              GO
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
