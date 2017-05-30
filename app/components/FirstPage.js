/*
This is the first screen the user sees if there is no data present if there is then the user is shown the SavedItemPage instead
*/
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text,View,Image,TextInput,Button, Alert,AsyncStorage,ScrollView } from 'react-native';
import {resetNavigator} from './../config/router';
import api from './../config/api';

export default class FirstPage extends Component {
  //constructor used to pre-create prop that will store api JSON array
  constructor(props) {
    super(props);
    this.state = {weatherData: []};
  }
  //if a 404 error appears page will not navigate over to next point
  onButtonPress(){
    this.props.navigation.navigate('LoadingPage');//initially loads screen to avoid perceved inaction
    api.getWeather(this.state.text).then((res) =>
    {
      this.setState({weatherData: res})
      if(this.state.weatherData.cod != '404')//if this is tripped it means the user entered data incorrectly
      {
        AsyncStorage.setItem(('k'+ this.state.text), this.state.text + ' ' + res.name)//saves information to AsyncStorage, and create easily replicated key
        .then(() =>{
          global.currentZip = this.state.text;//sets global variable to value just entered in
            this.props.navigation.dispatch(resetNavigator);//resets navigator to dis-allow the back button from pulling up a loading screen
        });
      }
      else{//if the 404 error is displayed then this alertbox appears and transfers the user back to the FirstPage
        this.props.navigation.navigate('FirstPage');//sends user back
        Alert.alert('Error','invalid zipcode');//shows error
      }
    });
  }
  render() {
    return (
      <View style={{flex:1, backgroundColor:'#6394e2'}}>
        <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('./../img/Logo.png')} style={styles.imageLogo} />
        <Text style={styles.welcome}>WeatherReact</Text>
        <TextInput style={styles.textbox} placeholder="Enter Zipcode" onChangeText={(text) => this.setState({text})}
        value={this.state.text}/>
        <Button title="Get Started!" onPress={() => this.onButtonPress()}/>
      </ScrollView>
    </View>
    );
  }
}
let styles = StyleSheet.create({
  imageLogo: {
    width: 200,
    height: 200,
    opacity: .75,
  },
  welcome: {
    fontSize: 45,
    color: 'black',
    textAlign: 'center',
    margin: 10,
  },
  container: {
    backgroundColor: '#6394e2',
    alignItems: 'center'
  },
  textbox:{
    height: 50,
    width:200,
    backgroundColor: '#b8cded',
    textAlign: 'center',
    fontSize: 25,
  },
});
AppRegistry.registerComponent('FirstPage', () => FirstPage);
