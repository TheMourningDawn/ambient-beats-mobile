import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import 'react-native-gesture-handler';
import Home from './ts/home/Home';
import Login from './ts/login/Login';
import {UserModel} from './ts/user/UserModel';
import userStore from './ts/user/UserStore';
import { Device } from './ts/device/Device';

const Stack = createStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState<Boolean>();
  const [user, setUser] = useState<UserModel>();

  useEffect(() => {
    userStore.getUser().then((user) => {
      setUser(user);
    });
  }, []);

  const styleSheet = StyleSheet.create({
    container: {
      backgroundColor: '#BFC0C0',
    },
  });

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!user || !user?.accessToken ? (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{title: 'Particle.io Login'}}
            />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen
              name="Device"
              component={Device}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{title: `Hello, ${user?.username}`}}
            />
            <Stack.Screen
              name="Device"
              component={Device}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
