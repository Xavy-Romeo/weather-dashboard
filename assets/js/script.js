var cityInput = '';

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

    var forecastEl1 = $('<div>').addClass('forecast').attr('id', 'forecast1');
    var forecastEl2 = $('<div>').addClass('forecast').attr('id', 'forecast2');
    var forecastEl3 = $('<div>').addClass('forecast').attr('id', 'forecast3');
    var forecastEl4 = $('<div>').addClass('forecast').attr('id', 'forecast4');
    var forecastEl5 = $('<div>').addClass('forecast').attr('id', 'forecast5');
    forecastDiv.append(forecastEl1, forecastEl2, forecastEl3, forecastEl4, forecastEl5);
};

var search = function(event) {
    // prevent refresh
    event.preventDefault();
    // store user input value for city
    cityInput = $('#search-input').val();
    // clear input value
    $('#search-input').val('');
    fetchCityWeather();
};

var fetchCityWeather = function() {
    if (cityInput === '') {
        var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=paris&appid=3a01189ad2669a4fe12bba52ee8f9ead&units=imperial';
    }
    else {
        var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + '&appid=3a01189ad2669a4fe12bba52ee8f9ead&units=imperial';
    }
    
    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(response){
        var cityInputData = response;
        fetchUvIndex(cityInputData);
        displayResults(cityInputData);
    });
};

var fetchUvIndex = function(cityData) {
    var uvIndexUrl = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + cityData.city.coord.lat + '&lon=' + cityData.city.coord.lon + '&appid=3a01189ad2669a4fe12bba52ee8f9ead';
    
    fetch(uvIndexUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        uvIndex = response.value;
        $('#uv-index').text(uvIndex);
    });  
}; 

var displayResults = function(cityData) {
 
    var dateData = cityData.list[0].dt_txt.split(' ');
    var date = dateData[0].split('-')
    var dateFormat = '(' + date[1] + '/' + date[2] + '/' + date[0] + ')';  
   
    var iconUrl = 'http://openweathermap.org/img/wn/' + cityData.list[0].weather[0].icon +'@2x.png';
    $('.title-icon').attr('src', iconUrl);

    $('.results-title').text(cityData.city.name + ' ' + dateFormat);
   
    $('#temperature').text(Math.round((cityData.list[0].main.temp)*10)/10 + ' \xB0F');
    $('#humidity').text(cityData.list[0].main.humidity + '%');
    $('#wind-speed').text(Math.round((cityData.list[0].wind.speed)*10)/10 + ' MPH');
    // $('#uv-index').text(uvIndex);

// add forecast after making elements in createElementDivs
};

var startup = function() {
    fetchCityWeather();
    createResultElements();
};

startup();
$('.form').on('submit', search);