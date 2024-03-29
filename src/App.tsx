import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import UserProfile from './screens/UserProfile';

const Stack = createNativeStackNavigator();

export default function App () {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Login" screenOptions={() => ({headerShown:false})}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Feed" component={UserProfile} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}


