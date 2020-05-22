import {Picker} from '@react-native-community/picker';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {FunctionResult} from '../DeviceModels';

export function DeviceFunction({id, functions, accessToken}: any) {
  const [selectedFunction, setSelectedFunction] = useState<string>('hue');
  const [functionInputValue, setFunctionInputValue] = useState<string>('');
  const [functionReturnCode, setFunctionReturnCode] = useState<number>();

  function runFunctionWithInput() {
    console.info(
      `POST https://api.particle.io/v1/devices/${id}/${selectedFunction}?access_token=${accessToken}&arg="${functionInputValue}"`,
    );
    var formData = new URLSearchParams();
    formData.append('access_token', accessToken);
    formData.append('args', functionInputValue);

    fetch(`https://api.particle.io/v1/devices/${id}/${selectedFunction}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })
      .then((response) => {
        const json: any = response.json();
        console.info(
          `Function Response - status ${response.status} - json: ${json}`,
        );
        return json;
      })
      .then((json) => {
        const functionResponse: FunctionResult = json as FunctionResult;
        setFunctionReturnCode(functionResponse.return_value);
      })
      .catch((error) => {
        console.error(error);
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
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#4F5D75',
      borderRadius: 20,
    },
    controlsContainer: {
      flex: 3,
      flexDirection: 'column',
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    selectorContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
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
    functionInputContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },
    textInput: {
      backgroundColor: '#BFC0C0',
      borderRadius: 10,
      width: '90%',
      marginRight: 10,
      marginLeft: 10,
    },
    button: {
      flex: 1,
      width: 100,
      height: '100%',
      backgroundColor: '#EF8354',
      borderRadius: 10,
      alignContent: 'center',
      justifyContent: 'center',
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
              <Text>No functions available</Text>
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
