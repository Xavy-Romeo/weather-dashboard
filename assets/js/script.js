var cityInput = '';
var idArr = [1,2,3,4,5];
var iArr = []

// new API I am switching to
var fetchCityWeather = function(cityInputData, cityLat, cityLon) {
    var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&appid=3a01189ad2669a4fe12bba52ee8f9ead&units=imperial';
    fetch(weatherApiUrl)
    .then(function(cityData){
        return cityData.json();
    })
    .then(function(cityData){
        displayResults(cityData, cityInputData);
    });
};

var createResultElements = function() {
    var displayResultsDiv = $('<div>');
        displayResultsDiv.addClass('results-current-div');
    var displayForecastDiv = $('<div>');
        displayForecastDiv.addClass('results-forcast-div');
    
    $('#results-container').append(displayResultsDiv, displayForecastDiv);

    var resultsTitleDiv = $('<div>').addClass('row results-title-div');
    var currentWeatherDiv = $('<div>').addClass('current-weather-div');
    displayResultsDiv.append(resultsTitleDiv, currentWeatherDiv);
    
    var resultsTitle = $('<p>').addClass('results-title');
    var titleIcon = $('<img>').addClass('title-icon');
    resultsTitleDiv.append(resultsTitle, titleIcon);

    var temperatureEl = $('<p>')
        .addClass('weather')
        .html('Temperature: <span id="temperature"></span>');
    var humidityEl = $('<p>')
        .addClass('weather')
        .html('Humidity: <span id="humidity"></span>');
    var windSpeedEl = $('<p>')
        .addClass('weather')
        .html('Wind Speed: <span id="wind-speed"></span>');
    var uvIndexEl = $('<p>')
        .addClass('weather')
        .html('UV Index: <span id="uv-index"></span>');
    currentWeatherDiv.append(temperatureEl, humidityEl, windSpeedEl, uvIndexEl);

    var forecastTitleEl = $('<p>').attr('id', 'forecast-title').text('5-Day Forecast:');
    var forecastDiv = $('<div>').addClass('row forecastDiv');
 
    $('#forecast-container').append(forecastTitleEl, forecastDiv);

    for(i=0; i<5; i++) {
    var forecastEl = $('<div>')
        .addClass('forecast')
        .attr('id', 'forecast' + idArr[i])
        .html('<p class="forecast-dates" id=date'+ idArr[i] +'></p><img id=forecast-icon'+ idArr[i] +'></img><p id=temp'+ idArr[i] +'></p><p id=humidity'+ idArr[i]+'></p>')
 
    forecastDiv.append(forecastEl);
    }
};

var search = function(event) {
    // prevent refresh
    event.preventDefault();
    // store user input value for city
    cityInput = $('#search-input').val();
    // clear input value
    $('#search-input').val('');
    fetchCityCoordinates();
};

var fetchCityCoordinates = function() {
    if (cityInput === '') {
        var inputApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=paris&appid=3a01189ad2669a4fe12bba52ee8f9ead&units=imperial';
    }
    else {
        var inputApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + '&appid=3a01189ad2669a4fe12bba52ee8f9ead&units=imperial';
    }
       
    fetch(inputApiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(response){
        var cityInputData = response;
                
        // pull lat and lon for new api
        cityLat = cityInputData.city.coord.lat;
        cityLon = cityInputData.city.coord.lon;
        
        fetchCityWeather(cityInputData, cityLat, cityLon);
        fetchUvIndex(cityInputData);
    });
};

var fetchUvIndex = function(cityInputData) {
    var uvIndexUrl = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + cityInputData.city.coord.lat + '&lon=' + cityInputData.city.coord.lon + '&appid=3a01189ad2669a4fe12bba52ee8f9ead';
    
    fetch(uvIndexUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        uvIndex = Math.round((response.value)*10)/10;
        $('#uv-index').text(uvIndex);
    });  
}; 

var displayResults = function(cityData, cityInputData) {
    console.log('cityData', cityData);   
    var unixDateData = cityData.current.dt;
    var date = new Date(unixDateData*1000).toLocaleDateString('en-US');
    var dateFormat = '(' + date + ')';
    
    var iconUrl = 'http://openweathermap.org/img/wn/' + cityInputData.list[0].weather[0].icon +'@2x.png';
    $('.title-icon').attr('src', iconUrl);

    $('.results-title').text(cityInputData.city.name + ' ' + dateFormat);
   
    $('#temperature').text(Math.round((cityData.current.temp)*10)/10 + ' \xB0F');
    $('#humidity').text(cityData.current.humidity + '%');
    $('#wind-speed').text(Math.round((cityData.current.wind_speed)*10)/10 + ' MPH');

    for (i = 0; i < 5; i++) {
        var unixDate = cityData.daily[i+1].dt*1000;
        var forecastDate = new Date (unixDate).toLocaleDateString('en-US'); 
        $('#date' + idArr[i]).text(forecastDate);
       
        var forecastIconUrl = 'http://openweathermap.org/img/wn/' + cityData.daily[i].weather[0].icon +'@2x.png';
        $('#forecast-icon' + idArr[i]).attr('src', forecastIconUrl);
        
        var forecastTemp = (cityData.daily[i].temp.max).toFixed(1);
        $('#temp' + idArr[i]).text('Temp: ' + forecastTemp + ' \xB0F');

        var forecastHumidity = cityData.daily[i].humidity;
        $('#humidity' + idArr[i]).text('Humidity: ' + forecastHumidity + ' \xB0F');
    }
};

fetchCityCoordinates();
createResultElements();
$('.form').on('submit', search);