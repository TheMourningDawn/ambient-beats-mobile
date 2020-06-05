import React, {useEffect, useState} from 'react';
import {StyleSheet, Switch, View, Text} from 'react-native';
import {FunctionResult, VariableResult} from '../DeviceModels';
import {useParticleAPI} from '../../../ParticleAPI';
import {deviceStyle} from '../Device';
import Slider from '@react-native-community/slider';

export function AudioReactiveToggle({id, accessToken}: any) {
  const [
    {audioReactiveOn, sensitivity, isError, isLoading},
    setAudioReactiveState,
    setSensitivity
  ] = useAudioReactiveState(id, accessToken);


  const style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      paddingLeft: 4,
    },
    toggleContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    toggle: {
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
        <Text style={[style.text, deviceStyle.sectionTitle]}>
          Audio Reactive Mode
        </Text>
        <Switch
          style={style.toggle}
          trackColor={{false: '#767577', true: '#bfc0c0'}}
          thumbColor={true ? '#ef8354' : '#2d3142'}
          onValueChange={(value) => {
            setAudioReactiveState(value);
          }}
          value={audioReactiveOn}
        />
      </View>
      <View style={style.sliderContainer}>
        <Text
          style={[
            style.text,
            deviceStyle.sectionTitle,
          ]}>{`Sensitivity: ${sensitivity}`}</Text>
        <Slider
          style={style.slider}
          value={sensitivity}
          minimumValue={500}
          maximumValue={2400}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          onSlidingComplete={(speed: number) => {
            setSensitivity(speed);
          }}
        />
      </View>
    </View>
  );
}

export const useAudioReactiveState = (
  deviceId: string,
  accessToken: string,
): [any, CallableFunction, CallableFunction] => {
  const [audioReactiveOn, setAudioReactiveOn] = useState<boolean>(false);
  const [sensitivity, setInternalSensitivity] = useState<number>(0);
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
          getAudioReactiveState();
          getSensitivity();
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
    mounted = false;
  }, []);

  function setAudioReactiveState(state: boolean) {
    functionRequest('toggle-audio-reactive', '').then(
      (result: FunctionResult) => {
        setAudioReactiveOn(!!result.return_value);
      },
    );
  }

  const getAudioReactiveState = () => {
    variableRequest('audio-on').then((result: VariableResult) => {
      setAudioReactiveOn(result.result == 'true');
    });
  };

  const getSensitivity = () => {
    variableRequest('sensitivity').then((result: VariableResult) => {
        if (!!result.result) {
            setInternalSensitivity(parseInt(result.result));
        }
    });
  };

  function setSensitivity(speed: number) {
    functionRequest('set-sensitivity', speed?.toString()).then(
      (result: FunctionResult) => {
        setInternalSensitivity(result.return_value);
      },
    );
  }

  return [{audioReactiveOn, sensitivity, isError, isLoading}, setAudioReactiveState, setSensitivity];
};
