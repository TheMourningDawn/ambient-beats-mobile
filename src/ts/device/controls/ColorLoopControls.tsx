import React, {useEffect, useState} from 'react';
import {StyleSheet, Switch, View, Text} from 'react-native';
import {FunctionResult, VariableResult} from '../DeviceModels';
import {useParticleAPI} from '../../../ParticleAPI';
import Slider from '@react-native-community/slider';
import { deviceStyle } from '../Device';

export function ColorLoopControls({id, accessToken}: any) {
  const [
    {colorLoopOn, colorLoopSpeed, isError, isLoading},
    setColorLoopState,
    setColorLoopSpeed,
  ] = useColorLoopControls(id, accessToken);

  const style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignContent: 'center',
      paddingLeft: 4
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
      paddingTop: 12
    },
    slider: {
      flex: 1,
      paddingTop: 8
    },
    text: {
      fontSize: 20,
      color: '#FFF',
    },
  });

  return (
    <View style={style.container}>
      <View style={style.toggleContainer}>
        <Text style={[style.text, deviceStyle.sectionTitle]}>Color Loop</Text>
        <Switch
          style={style.switch}
          trackColor={{false: '#767577', true: '#bfc0c0'}}
          thumbColor={true ? '#ef8354' : '#2d3142'}
          onValueChange={(value) => {
            setColorLoopState(value);
          }}
          value={colorLoopOn}
        />
      </View>
      <View style={style.sliderContainer}>
        <Text  style={[style.text, deviceStyle.sectionTitle]}>{`Speed: ${colorLoopSpeed}`}</Text>
        <Slider
          style={style.slider}
          value={colorLoopSpeed}
          minimumValue={1}
          maximumValue={50}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          onSlidingComplete={(speed: number) => {
            setColorLoopSpeed(speed);
          }}
        />
      </View>
    </View>
  );
}

export const useColorLoopControls = (
  deviceId: string,
  accessToken: string,
): [any, CallableFunction, CallableFunction] => {
  const [colorLoopOn, setColorLoopOn] = useState<boolean>(false);
  const [colorLoopSpeed, setInternalSpeed] = useState<number>(0);
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
          getColorLoopState();
          getColorLoopSpeed();
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
    mounted = false;
  }, []);

  const getColorLoopState = () => {
    variableRequest('color-loop-on').then((result: VariableResult) => {
      setColorLoopOn(result.result == 'true');
    });
  };

  function setColorLoopState(state: boolean) {
    functionRequest('toggle-color-loop', '').then((result: FunctionResult) => {
      setColorLoopOn(!!result.return_value);
    });
  }

  const getColorLoopSpeed = () => {
    variableRequest('color-loop-speed').then((result: VariableResult) => {
        if (!!result.result) {
            setInternalSpeed(parseInt(result.result));
        }
    });
  };

  function setColorLoopSpeed(speed: number) {
    functionRequest('set-color-loop-speed', speed?.toString()).then(
      (result: FunctionResult) => {
        setInternalSpeed(result.return_value);
      },
    );
  }

  return [
    {colorLoopOn, colorLoopSpeed, isError, isLoading},
    setColorLoopState,
    setColorLoopSpeed,
  ];
};
