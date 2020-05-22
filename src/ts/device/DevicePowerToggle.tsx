import React, {useEffect, useState} from 'react';
import {StyleSheet, Switch, View} from 'react-native';
import {FunctionResult, VariableResult} from './DeviceModels';

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
    console.info(
      `POST https://api.particle.io/v1/devices/${deviceId}/power?access_token=${accessToken}&arg="${
        state ? Power.ON : Power.OFF
      }"`,
    );
    var formData = new URLSearchParams();
    formData.append('access_token', accessToken);
    formData.append('args', state ? Power.ON : Power.OFF);

    fetch(`https://api.particle.io/v1/devices/${deviceId}/power`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })
      .then((response) => {
        console.log('SetPowerStateStatus: ' + response.status);
        const json: any = response.json();
        return json;
      })
      .then((json) => {
        const functionResponse: FunctionResult = json as FunctionResult;
        if (functionResponse.return_value > 0) {
          setPoweredOn(state);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const getPowerState = () => {
    console.info(
      `GET https://api.particle.io/v1/devices/${deviceId}/powered-on?access_token=${accessToken}`,
    );
    fetch(
      `https://api.particle.io/v1/devices/${deviceId}/powered-on?access_token=${accessToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    )
      .then((response) => {
        const json: Object = response.json();
        console.info(
          `getPowerState Response - status ${
            response.status
          } - json: ${JSON.stringify(json)}`,
        );
        return json;
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
        setPoweredOn(variableResult.result == 'true');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return [{poweredOn, isError, isLoading}, setPowerState];
};
