/*
The last item page exists as a secondary desision maker it checks to see if the user has any data left after a delete and if they dont it shows the FirstPage
repeated index
this is done so that the main page has a universal reference point cross platform
*/
import React, { Component } from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import {FirstPageNav, UserDataNav} from './../config/router';
import LoadingPage from './LoadingPage';

export default class LastItem extends Component {
//inital constructor that creates a user data check state item that i can use to check to see if user data is present
  constructor(props) {
    super(props);
    this.state = {userData: ' ',};
  }
  //ASYNC function that checks for any pre-existing keys to load
  _loadInitialState = async () => {
    AsyncStorage.getAllKeys().then((value) => {
      if (value == ''){
        this.setState({userData: 'false'});//if storage is not null then the props userData is set to true and data is imported into the saved page
      } else if(value[1] == null) {//this was added to correct a bug that appeared when the user deleted the zipcode they where on
        global.currentZip = value[0].substring(1)
        this.setState({userData: 'true'});//if false it shows the user the inital start screen
      }else{
        this.setState({userData: 'true'});//if false it shows the user the inital start screen
      }
    });
}
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
AppRegistry.registerComponent('LastItem', () => LastItem);
