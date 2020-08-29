import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {AnimationControls} from './controls/AnimationControls';
import {AnimationSpeed} from './controls/AnimationSpeed';
import {AudioReactiveToggle} from './controls/AudioReactiveToggle';
import {ColorLoopControls} from './controls/ColorLoopControls';
import {DeviceColorPicker} from './controls/ColorPicker';
import {DevicePowerToggle} from './controls/DevicePowerToggle';
import {ResetButton} from './controls/ResetButton';
import {SafeModeButton} from './controls/SafeModeButton';
import {DeviceSectionSeparator} from './DeviceSectionSeparator';
import {DeviceFunction} from './functions/DeviceFunction';
import {DeviceVariable} from './variables/DeviceVariable';

export const deviceStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d3142',
    marginBottom: 12,
    borderRadius: 6,
    margin: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 12,
  },
  sectionContainer: {
    paddingRight: 12,
    paddingLeft: 12,
  },
  title: {
    flex: 1,
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 26,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontWeight: '500',
    fontSize: 22,
    color: '#FFFFFF',
  },
});

export function Device({route}: any) {
  const {device, accessToken} = route.params;
  const [isAnimatedDevice, setIsAnimatedDevice] = useState<boolean>(false);

  useEffect(() => {
    checkIsAnimated();
  }, []);

  function checkIsAnimated() {
    if (!!device.variables.hue) {
      setIsAnimatedDevice(true);
    }
  }

  return (
    <>
      <View style={deviceStyle.container}>
        <View style={deviceStyle.headerContainer}>
          <Text style={deviceStyle.title}>{device?.name}</Text>
          <DevicePowerToggle id={device?.id} accessToken={accessToken} />
        </View>
        <DeviceSectionSeparator />
        {isAnimatedDevice && (
          <>
            <View style={deviceStyle.sectionContainer}>
              <AnimationControls id={device.id} accessToken={accessToken} />
            </View>
            <DeviceSectionSeparator />
            <View style={deviceStyle.sectionContainer}>
              <DeviceColorPicker id={device.id} accessToken={accessToken} />
            </View>
            <DeviceSectionSeparator />
          </>
        )}
        <ScrollView style={{flex: 0}}>
          {isAnimatedDevice && (
            <>
              <View style={deviceStyle.sectionContainer}>
                <AnimationSpeed id={device.id} accessToken={accessToken} />
              </View>
              <DeviceSectionSeparator />
              <View style={deviceStyle.sectionContainer}>
                <AudioReactiveToggle id={device.id} accessToken={accessToken} />
              </View>
              <DeviceSectionSeparator />
              <View style={deviceStyle.sectionContainer}>
                <ColorLoopControls id={device.id} accessToken={accessToken} />
              </View>
              <DeviceSectionSeparator />
            </>
          )}
          <View style={deviceStyle.sectionContainer}>
            <DeviceVariable
              reformattedVariables={device.reformattedVariables}
              id={device.id}
              accessToken={accessToken}
            />
          </View>
          <DeviceSectionSeparator />
          <View style={deviceStyle.sectionContainer}>
            <DeviceFunction
              functions={device.functions}
              id={device.id}
              accessToken={accessToken}
            />
          </View>
          <DeviceSectionSeparator />
          <View style={[deviceStyle.sectionContainer, {paddingBottom: 12}]}>
            <View style={{paddingBottom: 10}}>
              <ResetButton id={device.id} accessToken={accessToken} />
            </View>
            <SafeModeButton id={device.id} accessToken={accessToken} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
