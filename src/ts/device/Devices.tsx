import React from 'react';
import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { DeviceInfo } from './Device';
import { useDeviceInfo } from './DeviceDataSource';
import { DeviceFunction } from './DeviceFunction';
import { DeviceVariable } from './DeviceVariable';

export function Devices() {
  const [{deviceInfo, isError, currentUser}] = useDeviceInfo();

  const userCardStyle = StyleSheet.create({
    container: {
      display: 'flex',
      justifyContent: 'flex-start',
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#2d3142',
      paddingBottom: 50,
      marginBottom: 12,
      borderRadius: 20,
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingBottom: 12,
    },
    bodyContainer: {
      flex: 1,
      flexDirection: 'column',
      paddingLeft: 12,
      paddingRight: 12,
    },
    title: {
      flex: 1,
      marginLeft: 16,
      marginTop: 12,
      fontWeight: 'bold',
      fontSize: 24,
      color: '#FFFFFF',
    },
    switch: {
      flex: 1,
      marginRight: 12,
      marginTop: 12,
    },
  });

  function deviceCard(device: DeviceInfo) {
    // console.log(device)
    return (
      <>
        <View style={userCardStyle.container}>
          <View style={userCardStyle.headerContainer}>
            <Text style={userCardStyle.title}>{device?.name}</Text>
            <Switch
              style={userCardStyle.switch}
              trackColor={{false: '#767577', true: '#bfc0c0'}}
              thumbColor={true ? '#ef8354' : '#2d3142'}
              onValueChange={() => {}}
              value={true}
            />
          </View>
          <View style={userCardStyle.bodyContainer}>
            <DeviceVariable reformattedVariables={device.reformattedVariables} id={device.id} accessToken={currentUser?.accessToken}/>
            <DeviceFunction functions={device.functions} id={device.id} accessToken={currentUser?.accessToken}/>
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={{padding: 10}}>
      <FlatList
        data={deviceInfo}
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
