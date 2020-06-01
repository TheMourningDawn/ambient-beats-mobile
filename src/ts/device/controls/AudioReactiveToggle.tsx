import React, {useEffect, useState} from 'react';
import {StyleSheet, Switch, View, Text} from 'react-native';
import {FunctionResult, VariableResult} from '../DeviceModels';
import {useParticleAPI} from '../../../ParticleAPI';

export function AudioReactiveToggle({id, accessToken}: any) {
  const [
    {audioReactiveOn, isError, isLoading},
    setAudioReactiveState,
  ] = useAudioReactiveState(id, accessToken);

  const style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignContent: 'center',
      padding: 12,
    },
    switch: {
      flex: 1,
    },
    text: {
      fontSize: 20,
      color: '#FFF',
    },
  });

  return (
    <View style={style.container}>
      <Text style={style.text}>Toggle Audio Reactive</Text>
      <Switch
        style={style.switch}
        trackColor={{false: '#767577', true: '#bfc0c0'}}
        thumbColor={true ? '#ef8354' : '#2d3142'}
        onValueChange={(value) => {
          setAudioReactiveState(value);
        }}
        value={audioReactiveOn}
      />
    </View>
  );
}

export const useAudioReactiveState = (
  deviceId: string,
  accessToken: string,
): [any, CallableFunction] => {
  const [audioReactiveOn, setAudioReactiveOn] = useState<boolean>(false);
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
    functionRequest('toggle-audio-reactive', "").then(
      (result: FunctionResult) => {
        setAudioReactiveOn(!!result.return_value);
      },
    );
  }

  const getAudioReactiveState = () => {
    variableRequest('audio-on').then((result: VariableResult) => {
      setAudioReactiveOn(!!result.result);
    });
  };

  return [{audioReactiveOn, isError, isLoading}, setAudioReactiveState];
};
