import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Device } from './Device';
import { useDeviceInfo } from './DeviceDataSource';

export function DeviceList() {
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
        renderItem={({item}) => <Device device={item} accessToken={currentUser?.accessToken}/>}
      />
    </View>
  );
}
