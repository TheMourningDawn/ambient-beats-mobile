import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import userStore from '../user/UserStore';

export default function Login({navigation}: any) {
  const [username, setUsername] = useState(String);
  const [password, setPassword] = useState(String);

  function getToken() {
    var formData = new URLSearchParams();
    formData.append('grant_type', 'password')
    formData.append('username', username)
    formData.append('password', password)
    formData.append('client_id', 'particle')
    formData.append('client_secret', 'particlevi')

    fetch('https://api.particle.io/oauth/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })
    .then((response) => {
        return response.json()
    })

    .then((json) => {
      getUserInfo(json.access_token);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  function getUserInfo(accessToken: String) {
    fetch(`https://api.particle.io/v1/user?access_token=${accessToken}`)
      .then((response) => response.json())
      .then((json) => {
        userStore.setUser({
            accessToken: accessToken,
            username: json.username
        })
        navigation.navigate('Home')
      })
      .catch((error) => {
        console.error(error);
      });
  }  

  return (
    <View style={{padding: 10}}>
      <Text style={{padding: 10, fontSize: 42}}>Particle Login</Text>
      <TextInput
        style={{height: 40}}
        placeholder="username"
        onChangeText={(text) => setUsername(text)}
        defaultValue={username}
      />
      <TextInput
        style={{height: 40}}
        placeholder="password"
        onChangeText={(text) => setPassword(text)}
        defaultValue={password}
        secureTextEntry={true}
      />
      <Button
        title="LOG IN"
        onPress={() => getToken()}></Button>
    </View>
  );
}
