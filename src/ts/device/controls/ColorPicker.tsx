import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { fromHsv, TriangleColorPicker } from 'react-native-color-picker';
import { useParticleAPI } from '../../../ParticleAPI';
import { FunctionResult } from '../DeviceModels';

export function DeviceColorPicker({id, accessToken}: any) {
  const [{color}, setColor] = useNewColorState(id, accessToken);

  const [internalColor, setInternalColor] = useState<string>('#FFFFFF');
  const [oldColor, setOldColor] = useState<string>('#000');

  const style = StyleSheet.create({
    container: {
      flexDirection: 'column',
      width: '100%',
      height: 250,
    },
    slider: {
      flex: 1,
      padding: 8,
    },
  });

  return (
    <View style={style.container}>
      <TriangleColorPicker
        color={internalColor}
        defaultColor={internalColor}
        oldColor={oldColor}
        onColorChange={(color) => {
          const colorString = fromHsv(color);
          setInternalColor(colorString);
        }}
        onColorSelected={(color) => {
          setInternalColor(color);
          setColor(color);
        }}
        onOldColorSelected={(color) => {
          setOldColor(internalColor);
          setInternalColor(color);
          setColor(color);
        }}
        style={{flex: 1}}
      />
    </View>
  );
}

export const useNewColorState = (
  deviceId: string,
  accessToken: string,
): [any, CallableFunction] => {
  const tinycolor = require('tinycolor2');
  const [color, setInternalColor] = useState<string>('#FFFFFF');
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
          getColor();
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
    mounted = false;
  }, []);

  const getColor = () => {
    // variableRequest('hue').then((result: VariableResult) => {
    //   setInternalHue(parseInt(result.result));
    // });
  };

  function setColor(color: string) {
    var asRGB = tinycolor(color).toRgb(); // { r: 255, g: 0, b: 0, a: 1 }
    functionRequest('set-color', `${asRGB.r},${asRGB.g},${asRGB.b}`).then(
      (result: FunctionResult) => {
        if (result.return_value > 0) {
          setInternalColor(color);
        } else {
          setIsError(true);
        }
      },
    );
  }

  return [{color}, setColor];
};
