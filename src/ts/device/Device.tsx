import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AnimationControls} from './controls/AnimationControls';
import {AnimationSpeed} from './controls/AnimationSpeed';
import {AudioReactiveToggle} from './controls/AudioReactiveToggle';
import {ColorLoopControls} from './controls/ColorLoopControls';
import {DeviceColorPicker} from './controls/ColorPicker';
import {DevicePowerToggle} from './controls/DevicePowerToggle';
import {ResetButton} from './controls/ResetButton';
import {SafeModeButton} from './controls/SafeModeButton';
import {DeviceFunction} from './functions/DeviceFunction';
import {DeviceVariable} from './variables/DeviceVariable';

export const deviceStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#2d3142',
    marginBottom: 12,
    borderRadius: 10,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
  },
  controlsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 12,
  },
  advancedContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 12,
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
  accordianToggleButton: {
    alignSelf: 'center',
  },
});

export function Device({device, accessToken}: any) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isAnimatedDevice, setIsAnimatedDevice] = useState<boolean>(false);

  useEffect(() => {
    checkIsAnimated();
  }, []);

  function checkIsAnimated() {
    if (!!device.variables.hue) {
      setIsAnimatedDevice(true);
    }
  }

  function toggleExpanded() {
    setExpanded(!expanded);
  }

  return (
    <>
      <View style={deviceStyle.container}>
        <View style={deviceStyle.headerContainer}>
          <Text style={deviceStyle.title}>{device?.name}</Text>
          <View>
            <DevicePowerToggle id={device?.id} accessToken={accessToken} />
          </View>
        </View>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        {isAnimatedDevice && (
          <View style={deviceStyle.controlsContainer}>
            <AnimationControls id={device.id} accessToken={accessToken} />
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
            <DeviceColorPicker id={device.id} accessToken={accessToken} />
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginTop: 12,
                marginBottom: 12,
              }}
            />
            <AnimationSpeed id={device.id} accessToken={accessToken} />
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
            <AudioReactiveToggle id={device.id} accessToken={accessToken} />
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
            <ColorLoopControls id={device.id} accessToken={accessToken} />
          </View>
        )}
        {!!expanded && (
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        )}
        {!!expanded && (
          <View style={deviceStyle.advancedContainer}>
            <DeviceVariable
              reformattedVariables={device.reformattedVariables}
              id={device.id}
              accessToken={accessToken}
            />
            <DeviceFunction
              functions={device.functions}
              id={device.id}
              accessToken={accessToken}
            />
            <View style={{paddingBottom: 10}}>
              <ResetButton id={device.id} accessToken={accessToken} />
            </View>
            <SafeModeButton id={device.id} accessToken={accessToken} />
          </View>
        )}
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <View>
          <TouchableOpacity
            style={deviceStyle.accordianToggleButton}
            onPress={() => {
              toggleExpanded();
            }}>
            <Icon
              name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={30}
              color={'#FFF'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
