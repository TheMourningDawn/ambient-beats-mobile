import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useParticleAPI } from '../../../ParticleAPI';
import { FunctionResult, VariableResult } from '../DeviceModels';

export function DeviceColorPicker({id, accessToken}: any) {
  const [
    {hue, brightness, saturation, isError, isLoading},
    setHue, setBrightness, setSaturation,
  ] = userColorState(id, accessToken);

  const style = StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 12,
      //   flexDirection: 'column',
      //   alignContent: 'center',
    },
    titleText: {
      flex: 1,
      fontSize: 22,
      color: '#FFFFFF',
      marginLeft: 4,
    },
    hueSlider: {
      flex: 1,
      padding: 8
    }
  });

  return (
    <View style={style.container}>
      <Text style={style.titleText}>{"Hue: " + hue?.toString()}</Text>
      <Slider
        style={style.hueSlider}
        value={hue}
        minimumValue={0}
        maximumValue={255}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onSlidingComplete={(hue: number) => {
          setHue(hue);
        }}/>
      <Text style={style.titleText}>{"Brightness: " + brightness.toString()}</Text>
      <Slider
        style={style.hueSlider}
        value={brightness}
        minimumValue={0}
        maximumValue={255}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onSlidingComplete={(brightness: number) => {
          setBrightness(brightness);
        }}/>
      <Text style={style.titleText}>{"Saturation: " + saturation.toString()}</Text>
      <Slider
        style={style.hueSlider}
        value={saturation}
        minimumValue={0}
        maximumValue={255}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onSlidingComplete={(saturation: number) => {
          setSaturation(saturation);
        }}/>
    </View>
  );
}

export const userColorState = (
  deviceId: string,
  accessToken: string,
): [any, CallableFunction, CallableFunction, CallableFunction] => {
  const [hue, setInternalHue] = useState<number>(0);
  const [brightness, setInternalBrightness] = useState<number>(0);
  const [saturation, setInternalSaturation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [{functionResult}, functionRequest] = useParticleAPI(deviceId, accessToken)

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        if (mounted) {
          getHue();
          getBrightness();
          getSaturation();
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
    mounted = false;
  }, []);

  const getHue = () => {
    fetch(
      `https://api.particle.io/v1/devices/${deviceId}/hue?access_token=${accessToken}`,
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
        setInternalHue(parseInt(variableResult.result));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function setHue(hue: number) {
    functionRequest("set-hue", hue?.toString()).then((result: FunctionResult) => {
      setInternalHue(result.return_value)
    })
  }

  const getBrightness = () => {
    fetch(
      `https://api.particle.io/v1/devices/${deviceId}/brightness?access_token=${accessToken}`,
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
        setInternalBrightness(parseInt(variableResult.result));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function setBrightness(brightness: number) {
    functionRequest("set-brightness", brightness?.toString()).then((result: FunctionResult) => {
      setInternalBrightness(result.return_value)
    })
  }

  const getSaturation = () => {
    fetch(
      `https://api.particle.io/v1/devices/${deviceId}/saturation?access_token=${accessToken}`,
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
        setInternalSaturation(parseInt(variableResult.result));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function setSaturation(saturation: number) {
    functionRequest("set-saturation", saturation?.toString()).then((result: FunctionResult) => {
      setInternalHue(result.return_value)
    })
  }

  return [{hue, brightness, saturation, isError, isLoading}, setHue, setBrightness, setSaturation];
};
