import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AnimationControls } from './controls/AnimationControls';
import { DeviceColorPicker } from './controls/ColorPicker';
import { DevicePowerToggle } from './controls/DevicePowerToggle';
import { useDeviceInfo } from './DeviceDataSource';
import { DeviceInfo } from './DeviceModels';
import { DeviceFunction } from './functions/DeviceFunction';
import { DeviceVariable } from './variables/DeviceVariable';
import { AudioReactiveToggle } from './controls/AudioReactiveToggle';

export function Devices() {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [{deviceInfo, isError, currentUser}] = useDeviceInfo();

  const style = StyleSheet.create({
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
    accordianToggleButton: {
      alignSelf: 'center',
    },
  });

  function toggleExpanded() {
    setExpanded(!expanded);
  }

  function deviceCard(device: DeviceInfo) {
    return (
      <>
        <View style={style.container}>
          <View style={style.headerContainer}>
            <Text style={style.title}>{device?.name}</Text>
            <View>
              <DevicePowerToggle
                id={device?.id}
                accessToken={currentUser?.accessToken}
              />
            </View>
          </View>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View style={style.controlsContainer}>
            <AnimationControls
              id={device.id}
              accessToken={currentUser?.accessToken}
            />
            <DeviceColorPicker
              id={device.id}
              accessToken={currentUser?.accessToken}
            />
            <AudioReactiveToggle
              id={device.id}
              accessToken={currentUser?.accessToken}/>
          </View>
          {!!expanded && (
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
          )}
          {!!expanded && (
            <View style={style.advancedContainer}>
              <DeviceVariable
                reformattedVariables={device.reformattedVariables}
                id={device.id}
                accessToken={currentUser?.accessToken}
              />
              <DeviceFunction
                functions={device.functions}
                id={device.id}
                accessToken={currentUser?.accessToken}
              />
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
              style={style.accordianToggleButton}
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

  return (
    <View style={{padding: 10}}>
      <FlatList
        data={deviceInfo
          .filter((item) => {
            return !!item && item.connected;
          })
          .sort((a, b) => a.name.localeCompare(b.name))}
        ListEmptyComponent={
          <View>
            <Text>Nothing to see here</Text>
          </View>
        }
        renderItem={({item}) => deviceCard(item)}
      />
    </View>
  );
}
