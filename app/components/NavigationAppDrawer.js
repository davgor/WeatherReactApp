import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text,View,Image,TextInput,Button,ScrollView,AsyncStorage,Alert,TouchableOpacity } from 'react-native';
import {resetNavigator} from './../config/router';
import { Icon } from 'react-native-elements';

export default class NavigationAppDrawer extends Component {
  onExitPress(){
    this.props.navigation.navigate('DrawerClose');//button press that closes the drawer
  }
  onAboutPress(){
    Alert.alert('ABOUT','Verson 1.0');//alert that displays when the user clicks about
  }
  onTrashPress(key){
    global.currentZip = null;//this has to be wiped out so that it doesnt load an invalid key
    AsyncStorage.removeItem(key);//removes key from storage
    this.props.navigation.dispatch(resetNavigator);//resets UI preventing outdated data or the user backtracking into a dated page
  }
  onItemPress(zip){
    global.currentZip = zip;//changes global to correct zipcode
    this.props.navigation.dispatch(resetNavigator);//resets UI to load correct page and prevent user from going back
  }
  constructor(props) {
    super(props);
    this.state = {userData: 'false'}//used to prevent errors from occuring as the data is loaded in has no effect on drawergroup
    this.state = {masterKeys: []}//storage keys are placed in here
    this.state = {allCities: []}//pulled cities are placed in here
  }
  //ASYNC function that allows data to be pulled without killing the runtime
  _loadInitialState = async () => {
    let nameHolder = [];//local variable used to generate array for the state
    AsyncStorage.getAllKeys().then((value) => {
    for(let i = 0;i < value.length;i++){
        AsyncStorage.getItem(value[i]).then((city) => {
          nameHolder.push(city.substring(6));//grabs everything after the space in the storage item
          this.setState({allCities: nameHolder});//places city array in state
        });
      }
      this.setState({userData: 'false'});
      if (value == ' '){
        this.setState({userData: 'false'});// used to prevent errors
      }
      else {
        this.setState({masterKeys: value});
        this.setState({userData: 'true'});//if false it shows the user the inital start screen
      }
    });
}
//as far as i can tell this is executing the code above
componentWillMount() {
  this._loadInitialState().done();
  }

  render() {
    if(this.state.userData == 'true'){
      return (
        <View style={{flexDirection: 'column', justifyContent: 'space-between',flex: 1,backgroundColor: '#6394e2'}}>
            <ScrollView>
            <Text style={styles.menuHeader}>My Places</Text>
            {this.state.masterKeys.map((key,i) => (
              //unique keys had to be handed to each object to prevent warnings
              <View key={key+1} style={styles.savedItemsBox} >
              <Text
                key={key+2}
                style={styles.savedItemText}
                onPress={() => this.onItemPress(key.substring(1,6))}>
                {this.state.allCities[i]}
              </Text>
              <TouchableOpacity key={key+3} onPress={() => this.onTrashPress(key)}>
                <Icon key={key+4} name="cancel" size={20} color={'white'}/>
              </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
            <View>
              <Text style={styles.menuItems} onPress={() => this.onAboutPress()}>ABOUT</Text>
              <Text style={styles.menuItems} onPress={() => this.onExitPress()}>EXIT</Text>
            </View>
        </View>
      );
    }
    else{
      //nothing is loaded to prevent the ui from spazing out
      return(
        <View>

        </View>
      );
    }
  }
}

let styles = StyleSheet.create({
  menuItems: {
    borderWidth:4,
    borderColor: '#4782e0',
    textAlign:'center',
    color: 'blue',
    textDecorationLine: 'underline',
    padding: 20,
  },
  menuHeader: {
    borderWidth:4,
    borderColor: '#4782e0',
    textAlign:'center',
    fontSize:30,
    padding: 10,
  },
  menuTempFont: {
    fontSize: 45,
  },
  menuDayFont:{
    color: 'black',
    fontWeight: 'bold',
  },
  savedItemText:{
    textAlign: 'right',
    color: 'blue',
    textDecorationLine: 'underline',
  },
  savedItemsBox:{
    borderWidth:4,
    borderColor: '#4782e0',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

AppRegistry.registerComponent('NavigationAppDrawer', () => NavigationAppDrawer);
