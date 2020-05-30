import React, {useEffect, useState} from 'react';
import {StyleSheet, Switch, View} from 'react-native';
import {FunctionResult, VariableResult} from '../DeviceModels';
import { useParticleAPI } from '../../../ParticleAPI';

export namespace Power {
  export const ON: string = 'ON';
  export const OFF: string = 'OFF';
}

export function DevicePowerToggle({id, accessToken}: any) {
  const [{poweredOn, isError, isLoading}, setPowerState] = usePowerState(
    id,
    accessToken,
  );

  const style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignContent: 'center',
    },
    switch: {
      flex: 1,
    },
  });

  return (
    <View style={style.container}>
      <Switch
        style={style.switch}
        trackColor={{false: '#767577', true: '#bfc0c0'}}
        thumbColor={true ? '#ef8354' : '#2d3142'}
        onValueChange={(value) => {
          setPowerState(value);
        }}
        value={poweredOn}
      />
    </View>
  );
}

export const usePowerState = (
  deviceId: string,
  accessToken: string,
): [any, CallableFunction] => {
  const [poweredOn, setPoweredOn] = useState<boolean>(false);
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
          getPowerState();
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
    mounted = false;
  }, []);

  function setPowerState(state: boolean) {
    functionRequest("power", state ? Power.ON : Power.OFF).then((result: FunctionResult) => {
      if (result.return_value > 0) {
        setPoweredOn(state);
      }
    });
  }

  const getPowerState = () => {
    variableRequest("powered-on").then((result: VariableResult) => {
      setPoweredOn(result.result == 'true');
    });
  };

  return [{poweredOn, isError, isLoading}, setPowerState];
};
