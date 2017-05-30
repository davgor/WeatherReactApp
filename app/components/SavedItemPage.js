import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text,View,Image,AsyncStorage,TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import LoadingPage from './LoadingPage';
import api from './../config/api';

var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let date = new Date();
let today = (monthNames[date.getMonth()]) + " " + date.getDate() + " " + date.toLocaleTimeString();

//Function that decides what image best describes the weather based on a previous API call
let imageDecider = function(conditions){
  switch (conditions) {
    case 'Partly Cloudy': return (<Image source={require('./../img/PartlyCloudy.png')} style={{    width: 150, height: 150}} />); break;
    case 'Clear': return (<Image source={require('./../img/TheSun.png')} style={{    width: 150, height: 150}} />); break;
    case 'Snow': return (<Image source={require('./../img/Snow.png')} style={{    width: 150, height: 150}} />); break;
    case 'Thunder Snow': return (<Image source={require('./../img/ThunderSnow.png')} style={{    width: 150, height: 150}} />); break;
    case 'Thunder Storm': return (<Image source={require('./../img/ThunderStorm.png')} style={{    width: 150, height: 150}} />); break;
    case 'Misty': return (<Image source={require('./../img/Misty.png')} style={{    width: 150, height: 150}} />); break;
    case 'Clouds': return (<Image source={require('./../img/Clouds.png')} style={{    width: 150, height: 150}} />); break;
    case 'Rain': return (<Image source={require('./../img/Rain.png')} style={{    width: 150, height: 150}} />); break;
    default: return (<Image source={require('./../img/Logo.png')} style={{    width: 150, height: 150}} />);
  }
}
export default class SavedItemPage extends Component {
  //inital contructor allowing the loading of an api
  constructor(props) {
    super(props);
    this.state = {loaded: 'false',};//checks loading
    this.state = {weatherData: []};//to be filled with api data
    this.state = {masterKeys: []};//key list for use in auto loading of the page
  }
  //Buttons used to navigate the app
  onPlusPress(){
    this.props.navigation.navigate("FirstPage");
  }
  onNavPress(){
    this.props.navigation.navigate('DrawerOpen');
  }
  onFivePress(){
    this.props.navigation.navigate("FiveDayForecast");//loads the 5 day forcast
  }
  //converts temp and formats
  tempConvert(temp){
    return (Math.ceil(temp * 1.8 + 32)) + '°';
  }
  //data passed here is processed and placed into the state to be used for rendering information
  userData(key){//.thens are used to naturally delay processing allowing data to be created
    AsyncStorage.getItem(key).then((value) => {//ASYNC data grab
    api.getWeather(value.substring(0,5)).then((res) => {//api call grabing todays information
    global.currentZip = value.substring(0,5);
    //converts data from celcius
    let kphToMph = Math.ceil(res.wind.speed * 0.621371);//converts kph to mph
    this.setState({
      //places data in state to allow
      weatherTemp: this.tempConvert(res.main.temp),
      weatherLow: 'Low ' + this.tempConvert(res.main.temp_min),
      weatherHigh: 'High ' + this.tempConvert(res.main.temp_max),
      weatherHumid: res.main.humidity + '%',
      weatherWind: kphToMph + ' mph',
      weatherCon: res.weather[0].main,
      zipcode: value.substring(0,5)
      })
    this.setState({loaded: 'true'});//after code completes the loaded state is changed to true allowing the page to render
    });
  });
  }
  //ASYNC function that allows data to be pulled without killing the runtime
  _loadInitialState = async () => {
    zipcode = global.currentZip;//creates local zipcode variable from global variable
    if(zipcode == null){//if zipcode is empty then the page auto loaded from start up
      AsyncStorage.getAllKeys().then((key) => {//grabs data from storage and displays first piece of data
        this.setState({masterKeys: key});//fills masterkey prop
        let i = 0; //slight iterater to be used if the user deleted the first value on last load
        while(key[i] == ' '){
          i++;
        }
        this.userData(key[i]);//passes generated key to userData methods
      });
    }else{//this launches if data has been passed from the FirstPage
      AsyncStorage.getAllKeys().then((key) => {
        this.setState({masterKeys: key})
        this.userData('k' + zipcode);
      });
    }
}

componentWillMount() {
  this._loadInitialState().done();
}
render() {
  if (this.state.loaded == 'true') {//everything has loaded then the whole page is shown
  //the entire saved item page
  return (
      <View style={styles.container}>
        <View style={styles.menuTop}>
          <TouchableOpacity onPress={() => this.onNavPress()}>
            <Icon name="list" size={40} color={'white'}/>
          </TouchableOpacity>
          <Text style={styles.logotext}>weatherReact</Text>
          <TouchableOpacity onPress={() => this.onPlusPress()}>
            <Icon name="add" size={40} color={'white'}/>
          </TouchableOpacity>
        </View>
      <View style={{margin: 10, flexDirection: 'column'}}>
        <View style={styles.rowFormatt}>
          <View>
            <Text style={styles.rowFormatt}>{today}</Text>
            <View style={styles.rowFormatt}>
              <Text>{this.state.weatherHigh}</Text>
              <Text>{this.state.weatherLow}</Text>
            </View>
          </View>
          <Text style={{fontSize: 50,textAlign: 'center',marginBottom: 10,}}>{this.state.zipcode}</Text>
        </View>
        <View style={styles.rowFormatt}>
          <View>
            <Text style={{fontSize: 90,textAlign: 'center'}}>{this.state.weatherTemp}</Text>
            <Text onPress={() => this.onFivePress()} style={styles.forcastText}>View 5 Day Forcast</Text>
          </View>
          {imageDecider(this.state.weatherCon)}
        </View>
        <View style={{margin: 25,}}>
          <View style={styles.rowFormatt}>
            <Text>Conditions:</Text>
            <Text>{this.state.weatherCon}</Text>
          </View>
          <View style={styles.rowFormatt}>
            <Text>Wind Speed:</Text>
            <Text>{this.state.weatherWind}</Text>
          </View>
          <View style={styles.rowFormatt}>
            <Text>Humidity:</Text>
            <Text>{this.state.weatherHumid}</Text>
          </View>
        </View>
      </View>
      </View>
    );}
    else{
      return (
        <LoadingPage />//if no data is found then this page loads
      );
    }
  }
}

let styles = StyleSheet.create({
  rowFormatt:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  container: {
    backgroundColor: '#6394e2',
    flex: 1,
  },
    logotext: {
      fontSize: 25,
      textAlign: 'center',
      color: 'white'
    },
    menuTop: {
      alignItems: 'center',
      backgroundColor: '#357ae8',
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  forcastText:{
    textAlign: 'center',
    marginBottom: 5,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

AppRegistry.registerComponent('SavedItemPage', () => SavedItemPage);
