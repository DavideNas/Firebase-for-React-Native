import * as React from 'react';
import { StyleSheet, Image, View, Text, StatusBar, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import HeaderBar from '../components/HeaderBar';

export default function Feed ({navigation, route}: any) {
  const {userInfo} = route.params;

  const logOut = () => {
    auth().signOut().then(() => {
      navigation.navigate('Login');
    });
  };

  const { body, text, ScrollViewFlex, ScreenContainer } = styles;

  return (
    <View style={ScreenContainer}>
      <StatusBar backgroundColor="#ddd"/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ScrollViewFlex}>
        <HeaderBar title="Feeds" logOutHandler={logOut} />
        <View style={body}>
          <Text style={text}>Feed Page</Text>
          <Text style={text}>Email: {userInfo.email ? userInfo.email : undefined}</Text>
          <Text style={text}>Uid: {userInfo.uid ? userInfo.uid : undefined}</Text>
          {
            userInfo.displayName ?
            (<Text style={text}>Social Name: {userInfo.displayName ? userInfo.displayName : undefined}</Text>) :
            (<></>)
          }
          <Text style={text}>Image: {userInfo.photoURL ? userInfo.photoURL : undefined}</Text>
          <Image
            source = {{
              uri: userInfo.photoURL ? userInfo.photoURL : undefined,
              width: 200,
              height: 200,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  body: {
    flex:1,
    backgroundColor: '#444447',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  text: {
    color: '#ddd',
  },
});
