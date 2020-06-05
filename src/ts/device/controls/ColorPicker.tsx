import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useParticleAPI } from '../../../ParticleAPI';
import { FunctionResult, VariableResult } from '../DeviceModels';
import Slider from '@react-native-community/slider';
import { deviceStyle } from '../Device';

export function DeviceColorPicker({id, accessToken}: any) {
  const [
    {hue, brightness, saturation, isError, isLoading},
    setHue, setBrightness, setSaturation,
  ] = userColorState(id, accessToken);

  const style = StyleSheet.create({
    container: {
      flex: 1,
    },
    titleText: {
      flex: 1,
      marginLeft: 4,
    },
    slider: {
      flex: 1,
      padding: 8
    },
  });

  return (
    <View style={style.container}>
      <Text style={[style.titleText, deviceStyle.sectionTitle]}>{"Hue: " + hue?.toString()}</Text>
      <Slider
        style={style.slider}
        value={hue}
        minimumValue={0}
        maximumValue={255}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onSlidingComplete={(hue: number) => {
          setHue(hue);
        }}/>
      <Text style={[style.titleText, deviceStyle.sectionTitle]}>{"Brightness: " + brightness.toString()}</Text>
      <Slider
        style={style.slider}
        value={brightness}
        minimumValue={0}
        maximumValue={255}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onSlidingComplete={(brightness: number) => {
          setBrightness(brightness);
        }}/>
      <Text style={[style.titleText, deviceStyle.sectionTitle]}>{"Saturation: " + saturation.toString()}</Text>
      <Slider
        style={style.slider}
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
  const [{}, functionRequest, variableRequest] = useParticleAPI(deviceId, accessToken)

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
      variableRequest("hue").then((result: VariableResult) => {
        setInternalHue(parseInt(result.result))
      });
  };

  function setHue(hue: number) {
    functionRequest("set-hue", hue?.toString()).then((result: FunctionResult) => {
      setInternalHue(result.return_value)
    })
  }

  const getBrightness = () => {
    variableRequest("brightness").then((result: VariableResult) => {
      setInternalBrightness(parseInt(result.result))
    });
  };

  function setBrightness(brightness: number) {
    functionRequest("set-brightness", brightness?.toString()).then((result: FunctionResult) => {
      setInternalBrightness(result.return_value)
    })
  }

  const getSaturation = () => {
    variableRequest("saturation").then((result: VariableResult) => {
      setInternalSaturation(parseInt(result.result))
    });
  };

  function setSaturation(saturation: number) {
    functionRequest("set-saturation", saturation?.toString()).then((result: FunctionResult) => {
      setInternalSaturation(result.return_value)
    })
  }

  return [{hue, brightness, saturation, isError, isLoading}, setHue, setBrightness, setSaturation];
};
