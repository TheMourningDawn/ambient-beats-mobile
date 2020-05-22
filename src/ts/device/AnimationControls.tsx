import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {FunctionResult, VariableResult} from './DeviceModels';

export namespace Power {
  export const ON: string = 'ON';
  export const OFF: string = 'OFF';
}

export function AnimationControls({id, accessToken}: any) {
  const [
    {currentAnimationIndex, isError, isLoading},
    nextAnimation,
    previousAnimation,
  ] = useAnimationControls(id, accessToken);

  const style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row-reverse',
      margin: 20
    },
    textContainer: {
        flex: 1,
    },
    animationIndexText: {
      flex: 1,
      fontSize: 30,
      color: '#FFF',
      alignSelf: 'center',
    },
    button: {
      flex: 3,
      backgroundColor: '#EF8354',
      borderRadius: 10,
      alignContent: 'center',
      justifyContent: 'center',
    },
  });

  return (
      <>
    <View style={style.container}>
      <TouchableOpacity
        style={style.button}
        onPress={() => {
          nextAnimation();
        }}>
        <Text style={{fontSize: 16, color: '#FFFFFF', textAlign: 'center'}}>
          NEXT
        </Text>
      </TouchableOpacity>
      <View style={style.textContainer}>
        <Text style={style.animationIndexText}>{currentAnimationIndex}</Text>
      </View>
      <TouchableOpacity
        style={style.button}
        onPress={() => {
          previousAnimation();
        }}>
        <Text style={{fontSize: 16, color: '#FFFFFF', textAlign: 'center'}}>
          LAST
        </Text>
      </TouchableOpacity>
    </View>
    </>
  );
}

export const useAnimationControls = (
  deviceId: string,
  accessToken: string,
): [any, CallableFunction, CallableFunction] => {
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState<string>(
    '?',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        if (mounted) {
          getCurrentAnimation();
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
    mounted = false;
  }, []);

  const getCurrentAnimation = () => {
    fetch(
      `https://api.particle.io/v1/devices/${deviceId}/animation?access_token=${accessToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const jsonString = JSON.stringify(json, (key, value) => {
          if (typeof value === 'boolean' || typeof value === 'number') {
            return String(value);
          }
          return value;
        });

        const variableResult: VariableResult = JSON.parse(
          jsonString,
        ) as VariableResult;
        setCurrentAnimationIndex(variableResult.result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function nextAnimation() {
    var formData = new URLSearchParams();
    formData.append('access_token', accessToken);
    formData.append('args', 'NEXT');

    fetch(`https://api.particle.io/v1/devices/${deviceId}/change-animation`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const functionResponse: FunctionResult = json as FunctionResult;
        setCurrentAnimationIndex(`${functionResponse.return_value}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function previousAnimation() {
    var formData = new URLSearchParams();
    formData.append('access_token', accessToken);
    formData.append('args', 'PREVIOUS');

    fetch(`https://api.particle.io/v1/devices/${deviceId}/change-animation`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const functionResponse: FunctionResult = json as FunctionResult;
        setCurrentAnimationIndex(`${functionResponse.return_value}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return [
    {currentAnimationIndex, isError, isLoading},
    nextAnimation,
    previousAnimation,
  ];
};
