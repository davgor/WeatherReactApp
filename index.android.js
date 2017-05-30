/*
David Gorden
Index page used to start the app up
contains desision to see if user already has data present
*/
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text,View,Image,TextInput,AsyncStorage } from 'react-native';
import {FirstPageNav, UserDataNav} from './app/config/router';
import api from './app/config/api';
import LoadingPage from './app/components/LoadingPage';

global.currentZip;//global zip used to transport the main zipcode around the app
export default class WeatherReactApp extends Component {
//inital constructor that creates a user data check state item that i can use to check to see if user data is present
  constructor(props) {
    super(props);
    this.state = {userData: ' ',};//prop that is used to verify if user data already exists the ' ' means that the app is still pulling data and will display a loading screen
  }
  //ASYNC function that checks for any pre-existing keys to load
  _loadInitialState = async () => {
    AsyncStorage.getAllKeys().then((value) => {
      if (value == ''){
        this.setState({userData: 'false'});//if storage is not null then the props userData is set to true and data is imported into the saved page
      } else {
        this.setState({userData: 'true'});//if false it shows the user the inital start screen
      }
    });
}
//allows for prep of render
componentWillMount() {
  this._loadInitialState().done();
}
  render() {
    if (this.state.userData == 'false') {
      return (
        <FirstPageNav />//if no data is found then this page loads
      );
    }
    else if(this.state.userData == 'true') {
    return (
        <UserDataNav />//if data is found then this page loads
      );
    }
    else{
      return (
        <LoadingPage />//while data is being checked this shows
        );
    }
  }
}
AppRegistry.registerComponent('WeatherReactApp', () => WeatherReactApp);
