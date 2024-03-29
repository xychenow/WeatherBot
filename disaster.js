var request = require('request')

// Get disaster information use fema api
function getDisasterJson(state, callback, fallback) {
  // var url = "https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$top=10"
  var url = "http://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?\$filter=state eq "
  url += "'" + state + "'"
  url += "&\$format=json&\$orderby=incidentBeginDate desc&\$top=1"
  console.log(url)
  console.log("in getDisasterJson, url: ", url);

  requestJsonFile(url, function(body){
    console.log("in disaster request body, JSON: \n", JSON.stringify(body, null, 4));
    disasterMessage = body.DisasterDeclarationsSummaries[0]
    callback(disasterMessage);
  }, fallback);
}

//Using google map's api to get state name from city name
exports.getDisaster = function(cityName, callback, fallback) {
  var url = "http://maps.googleapis.com/maps/api/geocode/json?address="
  url += cityName
  url += "&sensor=false"
  console.log("in exports.getdisaster, url: ", url);
  
  requestJsonFile(url, function(body){
    console.log("in state name request body, JSON: \n", JSON.stringify(body, null, 4));
    var formatted_address = body.results[0].formatted_address.split(", ");
    var stateName = formatted_address[1];
    getDisasterJson(stateName, callback, fallback);
  }, fallback);
  
}

//Get json file
function requestJsonFile(url, callback, fallback) {
  request({
    url: url,
    json: true
  }, function (error, response, body) {
     if (!error && response.statusCode === 200) {
      callback(body);
     } else if (error){
      console.log("error while making get request:");
      console.log(JSON.stringify(error, null, 4));
      fallback(error);
     } else {
      console.log("HTTP error while making get request:");
      console.log(JSON.stringify(body, null, 4));
      fallback(error);
     }
  })
}





