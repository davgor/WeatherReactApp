import React, { Component } from 'react';
import { StackNavigator, DrawerNavigator, NavigationActions,ScrollView,Text } from 'react-navigation';
import SavedItemPage from './../components/SavedItemPage';
import FirstPage from './../components/FirstPage';
import NavigationAppDrawer from './../components/NavigationAppDrawer';
import FiveDayForecast from './../components/FiveDayForecast';
import LastItem from './../components/LastItem'
//nav drawer for the 5 day page
const FiveDayNav = DrawerNavigator({
    FiveDayForecast:{screen: FiveDayForecast,},
    NavigationAppDrawer: {screen: NavigationAppDrawer},
    FirstPage:{screen: FirstPage,},
  },
  {
    contentComponent: NavigationAppDrawer,
    drawerWidth: 200,
    drawerPosition: 'left',
  }
);
//nav drawer for saved item page
const UserNavDrawer = DrawerNavigator({
    SavedItemPage:{screen: SavedItemPage,},
    NavigationAppDrawer: {screen: NavigationAppDrawer},
    FirstPage:{screen: FirstPage,},
  },
  {
    contentComponent: NavigationAppDrawer,
    drawerWidth: 200,
    drawerPosition: 'left',
  }
);
//this navigator is loaded first or when the user deletes all their data
export const FirstPageNav = StackNavigator({
  FirstPage:{screen: FirstPage,navigationOptions:{header: null,}},
  SavedItemPage:{screen: UserNavDrawer,navigationOptions:{header: null}},
  FiveDayForecast:{screen: FiveDayNav,navigationOptions:{header: null}},
  LastItem:{screen: LastItem,navigationOptions:{header: null}},});
//if data is present then this navigator is loaded
export const UserDataNav = StackNavigator({
  SavedItemPage:{screen: UserNavDrawer,navigationOptions:{header: null}},
  FiveDayForecast:{screen: FiveDayNav,navigationOptions:{header: null}},
  FirstPage:{screen: FirstPage,navigationOptions:{header: null,}},
  LastItem:{screen: LastItem,navigationOptions:{header: null}},
});
//reset method
export const resetNavigator = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'LastItem'})
  ]
})
/*
*/
