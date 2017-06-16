import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text,View,Image,TextInput,Button,ScrollView,TouchableOpacity,AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import api from './../config/api';
import LoadingPage from './LoadingPage';
//image decider function that picks the appropriate picture for the icon
let imageDecider = function(conditions){
  switch (conditions) {
    case 'Partly Cloudy': return (<Image source={require('./../img/PartlyCloudy.png')} style={{    width: 75, height: 75}} />); break;
    case 'Clear': return (<Image source={require('./../img/TheSun.png')} style={{    width: 75, height: 75}} />); break;
    case 'Snow': return (<Image source={require('./../img/Snow.png')} style={{    width: 75, height: 75}} />); break;
    case 'Thunder Snow': return (<Image source={require('./../img/ThunderSnow.png')} style={{    width: 75, height: 75}} />); break;
    case 'Thunder Storm': return (<Image source={require('./../img/ThunderStorm.png')} style={{    width: 75, height: 75}} />); break;
    case 'Misty': return (<Image source={require('./../img/Misty.png')} style={{    width: 75, height: 75}} />); break;
    case 'Clouds': return (<Image source={require('./../img/Clouds.png')} style={{    width: 75, height: 75}} />); break;
    case 'Rain': return (<Image source={require('./../img/Rain.png')} style={{    width: 75, height: 75}} />); break;
    default: return (<Image source={require('./../img/Logo.png')} style={{    width: 75, height: 75}} />);
  }
}
class WeatherItem extends Component{
  //temp converter
  tempConvert(temp){
    return (Math.ceil(temp * 1.8 + 32)) + '°';
  }
  render(){
    return(
      <View style={styles.menuItems}>
        <View>
          <Text style={styles.menuDayFont}>{this.props.day}</Text>
          <Text>{this.props.conditions}</Text>
        </View>
        {imageDecider(this.props.conditions)}
        <Text style={styles.menuTempFont}>{this.tempConvert(this.props.weather)}</Text>
      </View>
    );
  }
}
export default class FiveDayForecast extends Component {
  //navigation buttons
  onNavPress(){
    this.props.navigation.navigate('DrawerOpen');
  }
  onPlusPress(){
    this.props.navigation.navigate("FirstPage");
  }
  //initial constructor
  constructor(props) {
    super(props);
    this.state = {weatherData: []};//used to hold array
    this.state = {loaded: 'false'}//used to determine if the loading screen should show or not
  }
  //method that modifies the string into a more readable date
  dateParser(dayOut){
    var day = ["Sun","Mon","Tue","Wen","Thu","Fri","Sat"];
    let date = new Date();
    let final = date.getDay() + dayOut;//the current day plus the day being rendered
    if(final > 6){final = final - 7} //if that day is larger then six it subtracts 7 to get the final day
    return day[final];//sends string back out
  }
    _loadInitialState = async () => {
      zipcode = global.currentZip;
      AsyncStorage.getItem('k' + zipcode).then((value) => {
        api.getFiveDay(value.substring(0,5)).then((res) => {
        this.setState({
          //w means weather, c means conditions, d means day
          //limitations within the free api means that dates have to be pre selected the exact info needed is then passed to the state
          zipcode: value.substring(0,5),
          //day one
          wDayOne: res.list[0].main.temp,
          cDayOne: res.list[0].weather[0].main,
          dDayOne: this.dateParser(0),
          //day two
          wDayTwo: res.list[7].main.temp,
          cDayTwo: res.list[7].weather[0].main,
          dDayTwo: this.dateParser(1),
          //day three
          wDayThree: res.list[15].main.temp,
          cDayThree: res.list[15].weather[0].main,
          dDayThree: this.dateParser(2),
          //day four
          wDayFour: res.list[23].main.temp,
          cDayFour: res.list[23].weather[0].main,
          dDayFour: this.dateParser(3),
          //day five
          wDayFive: res.list[30].main.temp,
          cDayFive: res.list[30].weather[0].main,
          dDayFive: this.dateParser(4),
          })
          this.setState({loaded: 'true'});//after data has been placed into the state the page is now allowed to render
        });
      });
    }
  componentWillMount() {
    this._loadInitialState().done();
  }
  render() {
    if (this.state.loaded == 'true') {//everything has loaded then the whole page is shown
      return (
        <View style={{backgroundColor: '#6394e2', flex:1 }}>
          <View style={styles.menuTop}>
            <TouchableOpacity onPress={() => this.onNavPress()}>
              <Icon name="list" size={40} color={'white'}/>
            </TouchableOpacity>
            <Text style={styles.logotext}>weatherReact</Text>
            <TouchableOpacity onPress={() => this.onPlusPress()}>
              <Icon name="add" size={40} color={'white'}/>
            </TouchableOpacity>
          </View>
          <View style={styles.flexRowItems}>
            <Text style={{fontSize: 20, color: 'black'}}>5 Day Forcast</Text>
            <Text style={styles.welcome}>{this.state.zipcode}</Text>
          </View>
          <WeatherItem weather={this.state.wDayOne} conditions={this.state.cDayOne} day={this.state.dDayOne}/>
          <WeatherItem weather={this.state.wDayTwo} conditions={this.state.cDayTwo} day={this.state.dDayTwo}/>
          <WeatherItem weather={this.state.wDayThree} conditions={this.state.cDayThree} day={this.state.dDayThree}/>
          <WeatherItem weather={this.state.wDayFour} conditions={this.state.cDayFour} day={this.state.dDayFour}/>
          <WeatherItem weather={this.state.wDayFive} conditions={this.state.cDayFive} day={this.state.dDayFive}/>
        </View>
      );
    }
    else{
      return(<LoadingPage/>);
    }
  }
}
let styles = StyleSheet.create({
  imageLogo: {
    width: 75,
    height: 75
  },
  welcome: {
    fontSize: 30
  },
  flexRowItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth:4,
    borderColor: '#357ae8',
  },
  menuItems: {
    borderWidth:4,
    borderColor: '#357ae8',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuTempFont: {
    fontSize: 45,
  },
  menuDayFont:{
    color: 'black',
    fontWeight: 'bold',
    fontSize:20,
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
});
AppRegistry.registerComponent('FiveDayForecast', () => FiveDayForecast);
