import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {FunctionResult, VariableResult} from '../DeviceModels';
import { useParticleAPI } from '../../../ParticleAPI';

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
      flexDirection: 'row-reverse',
      height: 50,
    },
    textContainer: {
      flex: 1,
    },
    animationIndexText: {
      fontSize: 36,
      color: '#FFF',
      alignSelf: 'center',
    },
    button: {
      flex: 3,
      backgroundColor: '#EF8354',
      borderRadius: 6,
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
  const [{}, functionRequest, variableRequest] = useParticleAPI(deviceId, accessToken)

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
    variableRequest("animation").then((result: VariableResult) => {
      setCurrentAnimationIndex(result.result);
    });
  };

  function nextAnimation() {
    functionRequest("change-animation", "NEXT").then((result: FunctionResult) => {
      setCurrentAnimationIndex(result.return_value.toString());
    });
  }

  function previousAnimation() {
    functionRequest("change-animation", "PREVIOUS").then((result: FunctionResult) => {
      setCurrentAnimationIndex(result.return_value.toString());
    });
  }

  return [
    {currentAnimationIndex, isError, isLoading},
    nextAnimation,
    previousAnimation,
  ];
};
