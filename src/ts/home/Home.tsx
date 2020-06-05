import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {DeviceList} from '../device/DeviceList';
import {UserModel} from '../user/UserModel';
import userStore from '../user/UserStore';

export default function Home({navigation}: any) {
  const [user, setUser] = useState<UserModel>();

  useEffect(() => {
    userStore
      .getUser()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const styleSheet = StyleSheet.create({
    container: {
      backgroundColor: '#BFC0C0',
    },
  });

  return (
    <>
      <View style={styleSheet.container}>
        <DeviceList></DeviceList>
      </View>
    </>
  );
}
