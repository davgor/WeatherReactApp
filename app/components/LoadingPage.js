import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text,View,Image,TextInput,Button } from 'react-native';

export default class LoadingPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('./../img/Logo.png')} style={styles.imageLogo} />
        <Text style={styles.welcome}>weatherReact</Text>
        <Text style={styles.welcome}>Loading....</Text>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  imageLogo: {
    width: 250,
    height: 250
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#6394e2',
    alignItems: 'center'
  },
});
AppRegistry.registerComponent('LoadingPage', () => LoadingPage);
