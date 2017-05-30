/*
API function page
NOTES:
  there were limitations with the free version
    --Max 5 day forcast, loads in 3 hour intervals not daily
    --no state reference in JSON
*/
var api ={
  //method used to grab data from today
  getWeather(zipcode){
    var url = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipcode +',us&APPID=fb4b17b42c342837829f20edb79c555f&units=Metric';
    return fetch(url).then((res) => res.json());
  },
  //method used to grab 5 days worth of data 
  getFiveDay(zipcode){
    var url = 'http://api.openweathermap.org/data/2.5/forecast?zip=' + zipcode +',us&APPID=fb4b17b42c342837829f20edb79c555f&units=Metric';
    return fetch(url).then((res) => res.json());
  }
};
 module.exports = api;
