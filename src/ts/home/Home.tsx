import React, { useEffect, useState } from 'react';
import { Devices } from '../device/Devices';
import { UserModel } from '../user/UserModel';
import userStore from '../user/UserStore';
import { View, StyleSheet } from 'react-native';

export default function Home({navigation}: any) {
  const [user, setUser] = useState<UserModel>();

  useEffect(() => {
    userStore.getUser().then((user) => {
      setUser(user);
    }).catch((error) => {
      console.error(error)
    });
  }, []);

  const styleSheet = StyleSheet.create({
    container: {
      backgroundColor: "#BFC0C0"
    }
  })

  return (
    <>
    <View style={styleSheet.container}>
      <Devices></Devices>
    </View>
    </>
  );
}
