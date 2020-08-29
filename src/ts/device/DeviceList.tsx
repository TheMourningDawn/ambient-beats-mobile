import React from 'react';
import {FlatList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useDeviceInfo} from './DeviceDataSource';
import {DevicePowerToggle} from './controls/DevicePowerToggle';
import { useNavigation } from '@react-navigation/native';
import { Device } from './DeviceModels';

export function DeviceList() {
  const [{devices, isError, currentUser}] = useDeviceInfo();
  const navigation = useNavigation();

  const style = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#2d3142',
      borderRadius: 6,
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      padding:12
    },
    title: {
      flex: 1,
      marginLeft: 4,
      fontWeight: 'bold',
      fontSize: 26,
      color: '#FFFFFF',
    },
  });

  const renderDevicePreview = (device: Device) => {
    return <>
      <TouchableOpacity
        style={style.container}
        onPress={() => {
          navigation.navigate({name: 'Device', params: {
            device: device,
            accessToken: currentUser?.accessToken,
          }});
        }}>
        <View style={style.headerContainer}>
          <Text style={style.title}>{device?.name}</Text>
          <View>
            <DevicePowerToggle
              id={device?.id}
              accessToken={currentUser?.accessToken}
            />
          </View>
        </View>
      </TouchableOpacity>
    </>
  };

  return (
    <View style={{padding: 10}}>
      <FlatList
        data={devices
          .filter((item: Device) => {
            return !!item && item.connected;
          })
          .sort((a, b) => a.name.localeCompare(b.name))}
        ListEmptyComponent={
          <View>
            <Text>Nothing to see here</Text>
          </View>
        }
        renderItem={({item}) => {
          return renderDevicePreview(item)
        }}
        ItemSeparatorComponent={() => (
          <>
          <View style={{padding: 6}}></View>
          </>
        )}
      />
    </View>
  );
}
