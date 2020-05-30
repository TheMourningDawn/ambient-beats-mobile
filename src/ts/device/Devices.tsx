import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useDeviceInfo} from './DeviceDataSource';
import {DeviceInfo} from './DeviceModels';
import {DevicePowerToggle} from './controls/DevicePowerToggle';
import {DeviceFunction} from './functions/DeviceFunction';
import {DeviceVariable} from './variables/DeviceVariable';
import { AnimationControls } from './controls/AnimationControls';
import { DeviceColorPicker } from './controls/ColorPicker';

export function Devices() {
  const [{deviceInfo, isError, currentUser}] = useDeviceInfo();

  const userCardStyle = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#2d3142',
      padding: 12,
      marginBottom: 12,
      borderRadius: 10,
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingBottom: 12,
    },
    bodyContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    title: {
      flex: 1,
      marginLeft: 4,
      fontWeight: 'bold',
      fontSize: 26,
      color: '#FFFFFF',
    },
    
  });

  function deviceCard(device: DeviceInfo) {
    return (
      <>
        <View style={userCardStyle.container}>
          <View style={userCardStyle.headerContainer}>
            <Text style={userCardStyle.title}>{device?.name}</Text>
            <View>
              <DevicePowerToggle
                id={device?.id}
                accessToken={currentUser?.accessToken}
              />
            </View>
          </View>
          <View style={userCardStyle.bodyContainer}>
            <AnimationControls id={device.id} accessToken={currentUser?.accessToken}/>
            <DeviceColorPicker id={device.id} accessToken={currentUser?.accessToken}></DeviceColorPicker>
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
        </View>
      </>
    );
  }

  return (
    <View style={{padding: 10}}>
      <FlatList
        data={deviceInfo.filter((item) => {
            return !!item && item.connected;
        }).sort((a, b) => a.name.localeCompare(b.name))}
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
