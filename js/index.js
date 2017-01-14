var latitude = "";
var longitude = "";
var apiResult = "";
var userLocation = "";
var tempertureC = "";
var tempertureF = "";
var description = "";
var imageURL = "";
var displayTemperatureInCelsius = true;

function setTemperature() {
  if(displayTemperatureInCelsius) {
    console.log("Setting temp in C");
    $(".temperature").text(temperatureC);
    $("#temp_units").text(" ºC");
  } else {
    console.log("Setting temp in F");
    $(".temperature").text(temperatureF);
    $("#temp_units").text(" ºF");
  }
  
}

function gotGeolocation(position) {
  latitude = position.coords.latitude;
  //latitude = 37.77999878;
  longitude = position.coords.longitude;
  //longitude = -122.41999817;
  console.log("Got position: " + latitude + ", " + longitude);
  
  var apiUrl = "https://api.wunderground.com/api/87fcd9eb94a17f4b/conditions/q/" + latitude + "," + longitude + ".json";
  
  $.getJSON(apiUrl, function(json) {
    apiResult = JSON.stringify(json);
    console.log("Weather API result: " + apiResult);
    
    if(!json.hasOwnProperty("current_observation")) {
      document.getElementById("loader").style.display = "none";
      $(".message").html("<div class='alert alert-danger' role='alert'>Could not get local weather: " + json.message + "</div>");
      return;
    }
    
    temperatureC = json.current_observation.temp_c;
    temperatureF = json.current_observation.temp_f;
    userLocation = json.current_observation.display_location.full;
    description = json.current_observation.weather;
    imageURL = "https://icons.wxug.com/i/c/h/" + json.current_observation.icon + ".gif";
          
    document.getElementById("loader").style.display = "none";
    setTemperature();
    $(".location").html(userLocation);
    $(".description").html(description);
    $(".weather_image").html("<img class='center-block teste' src='" + imageURL + "' />");
  });
  
}

function errorGettingGeolocation(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
  document.getElementById("loader").style.display = "none";
  $(".message").html("<div class='alert alert-danger' role='alert'>Could not retrieve your location: " + err.message + "</div>");
};

function getGeoLocation() {
  if (navigator.geolocation) {
    
    var options = {
      timeout: 10000
    };
    
    navigator.geolocation.getCurrentPosition(gotGeolocation, errorGettingGeolocation, options);
      
  } else {
    document.getElementById("loader").style.display = "none";
    $(".message").html("<div class='alert alert-danger' role='alert'>Sorry, your browser does not support geolocation!</div>");
  }
}

$(document).ready(function() {
  getGeoLocation();
});

$("#temp_units").click(function() {
  displayTemperatureInCelsius = !displayTemperatureInCelsius;
  setTemperature();
});