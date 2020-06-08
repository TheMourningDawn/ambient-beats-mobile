import Slider from '@react-native-community/slider';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useParticleAPI} from '../../../ParticleAPI';
import {FunctionResult, VariableResult} from '../DeviceModels';
import { deviceStyle } from '../Device';

export function AnimationSpeed({id, accessToken}: any) {
  const [{speed, isError, isLoading}, setSpeed] = useAnimationSpeed(
    id,
    accessToken,
  );

  const style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignContent: 'center',
    },
    toggleContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    switch: {
      flex: 1,
    },
    sliderContainer: {
      flex: 1,
    },
    slider: {
      flex: 1,
      padding: 8,
    },
    text: {
      flex: 1,
      marginLeft: 4,
    },
  });

  return (
    <View style={style.container}>
      <View style={style.sliderContainer}>
        <Text style={[style.text, deviceStyle.sectionTitle]}>{`Animation Speed: ${100 - speed}%`}</Text>
        <Slider
          style={style.slider}
          value={speed}
          minimumValue={0}
          maximumValue={100}
          inverted={true}
          minimumTrackTintColor="#000"
          maximumTrackTintColor="#FFF"
          onSlidingComplete={(speed: number) => {
            setSpeed(speed);
          }}
        />
      </View>
    </View>
  );
}

export const useAnimationSpeed = (
  deviceId: string,
  accessToken: string,
): [any, CallableFunction] => {
  const [speed, setInternalSpeed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [{}, functionRequest, variableRequest] = useParticleAPI(
    deviceId,
    accessToken,
  );

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        if (mounted) {
          getSpeed();
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
    mounted = false;
  }, []);

  const getSpeed = () => {
    variableRequest('speed').then((result: VariableResult) => {
      if (!!result.result) {
        setInternalSpeed(parseInt(result.result));
      }
    });
  };

  function setSpeed(speed: number) {
    functionRequest('set-speed', speed?.toString()).then(
      (result: FunctionResult) => {
        setInternalSpeed(result.return_value);
      },
    );
  }

  return [{speed, isError, isLoading}, setSpeed];
};
