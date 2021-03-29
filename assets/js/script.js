// stores user input value
var cityInput = '';
var idArr = [1,2,3,4,5];

var search = function(event) {
    // prevent refresh
    event.preventDefault();
    // store user input value for city
    cityInput = $('#search-input').val().toUpperCase();
    // clear input value
    $('#search-input').val('');
    fetchCityCoordinates();
};

var fetchCityCoordinates = function() {
    // run a default page load fetch
    if (cityInput === '') {
        var inputApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=torrance&appid=3a01189ad2669a4fe12bba52ee8f9ead&units=imperial';
    }
    // fetch info based on user input
    else {
        var inputApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + '&appid=3a01189ad2669a4fe12bba52ee8f9ead&units=imperial';
    }
    
    // fetch data
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
        fetchUvIndex(cityLat, cityLon);
    });
};

var fetchCityWeather = function(cityInputData, cityLat, cityLon) {
    var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&appid=3a01189ad2669a4fe12bba52ee8f9ead&units=imperial';
    // fetch weather data based on lat & lon
    fetch(weatherApiUrl)
    .then(function(cityData){
        return cityData.json();
    })
    .then(function(cityData){
        displayResults(cityData, cityInputData);
        storeHistory(cityInputData);
    });
};

var fetchUvIndex = function(cityLat, cityLon) {
    // store value of url based on lat & lon
    var uvIndexUrl = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + cityLat + '&lon=' + cityLon + '&appid=3a01189ad2669a4fe12bba52ee8f9ead';
    
    // fetch UV index data
    fetch(uvIndexUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        uvIndex = Math.round((response.value)*10)/10;
        $('#uv-index').text(uvIndex);

        // Set color based on UV index
        if (uvIndex <= 2.999) {
            $('#uv-index').css('background-color', 'green');
        }
        else if (uvIndex <= 5.999) {
            $('#uv-index').css('background-color', 'yellow');
        }
        else if (uvIndex <= 7.999) {
            $('#uv-index').css('background-color', 'orange');
        }
        else if (uvIndex <= 10.999) {
            $('#uv-index').css('background-color', 'red');
        }
        else {
            $('#uv-index').css('background-color', 'purple');
        }
    });  
}; 

// creates page elements
var createResultElements = function() {
    // creates divs to hold current and forecast data
    var displayResultsDiv = $('<div>');
        displayResultsDiv.addClass('results-current-div');
    var displayForecastDiv = $('<div>');
        displayForecastDiv.addClass('results-forcast-div');
    
    $('#results-container').append(displayResultsDiv, displayForecastDiv);

    // current weather elements
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
    // end current weather elements

    // forecast weather elements
    var forecastTitleEl = $('<p>').attr('id', 'forecast-title').text('5-Day Forecast:');
    var forecastDiv = $('<div>').addClass('row forecastDiv');
 
    $('#forecast-container').append(forecastTitleEl, forecastDiv);

    // for loop for 5 day forecast 
    for(i=0; i<5; i++) {
        var forecastEl = $('<div>')
            .addClass('forecast')
            .attr('id', 'forecast' + idArr[i])
            .html('<p class="forecast-dates" id=date'+ idArr[i] +'></p>'+
                '<img id=forecast-icon'+ idArr[i] +'></img>'+
                '<p id=temp'+ idArr[i] +'></p>'+
                '<p id=humidity'+ idArr[i]+'></p>');
 
        forecastDiv.append(forecastEl);
    }
    // end forecast elements
};

var displayResults = function(cityData, cityInputData) {
    // get unix date data and format it
    var unixDateData = cityData.current.dt;
    var date = new Date(unixDateData*1000).toLocaleDateString('en-US');
    var dateFormat = '(' + date + ')';
    
    // get weather icon based on weather data
    var iconUrl = 'http://openweathermap.org/img/wn/' + cityInputData.list[0].weather[0].icon +'@2x.png';
    $('.title-icon').attr('src', iconUrl);

    // current weather data
    // current weather title
    $('.results-title').text(cityInputData.city.name + ' ' + dateFormat);
    // current temperature
    $('#temperature').text(Math.round((cityData.current.temp)*10)/10 + ' \xB0F');
    // current humidity
    $('#humidity').text(cityData.current.humidity + '%');
    // current wind speed
    $('#wind-speed').text(Math.round((cityData.current.wind_speed)*10)/10 + ' MPH');

    // for loop for forecast
    for (i = 0; i < 5; i++) {
        // forecast date
        var unixDate = cityData.daily[i+1].dt*1000;
        var forecastDate = new Date (unixDate).toLocaleDateString('en-US'); 
        $('#date' + idArr[i]).text(forecastDate);
       
        // forecast weather icon
        var forecastIconUrl = 'http://openweathermap.org/img/wn/' + cityData.daily[i].weather[0].icon +'@2x.png';
        $('#forecast-icon' + idArr[i]).attr('src', forecastIconUrl);
        
        // forecast temperature
        var forecastTemp = (cityData.daily[i].temp.max).toFixed(1);
        $('#temp' + idArr[i]).text('Temp: ' + forecastTemp + ' \xB0F');
        
        // forecast humidity
        var forecastHumidity = cityData.daily[i].humidity;
        $('#humidity' + idArr[i]).text('Humidity: ' + forecastHumidity + ' \xB0F');
    }
};

// function to store history of user inputs
var storeHistory = function(cityInputData) {
    var cityName = cityInputData.city.name.toUpperCase();
    var historyArr;

    // do not save default search
    if (cityInput === ''){
        return;
    }
    // create local storage object
    else if (!localStorage.getItem('city'))
    {
        console.log('test test test 169');
        var newHistoryArr = [];
        newHistoryArr.push(cityName);
        var jsonNewHistory = JSON.stringify(newHistoryArr);
        localStorage.setItem('city', jsonNewHistory);
    }
    // retrieve local storage info and add each additional input
    else {
        var historyArrString = localStorage.getItem('city')
        var historyArr = JSON.parse(historyArrString);
               
        for( var i = 1; i < historyArr.length; i++){ 
            // do not show duplicate values in search history                       
            if ( historyArr[i] === cityInput) { 
                historyArr.splice(i, 1); 
            }
        };

        // add each user input to local storage
        // place most recent user input search item at the top
        historyArr.unshift(cityName);
        // set maximum history to 8 inputs
        historyArr.splice(8);
        var jsonHistory = JSON.stringify(historyArr);
        localStorage.setItem('city', jsonHistory);
    }
   
   displayHistory();
};

// function to display user search history 
var displayHistory = function() {
    // clear previous history to not display duplicate histories
    $('.history-items').remove();
    var historyArr = JSON.parse(localStorage.getItem('city'));
    

    if (!historyArr) {
        return;
    }
    else {
        // loop to create a <p> element for each search item in history
        for (i = 0; i < historyArr.length; i++) {
            var historyDiv = $('<p>')
                .addClass('history-items')
                .text(historyArr[i]);
        
            $('#history-container').append(historyDiv);
        }
    }
};

// run programs on start-up
fetchCityCoordinates();
createResultElements();
displayHistory();

// start search on user submit
$('.form').on('submit', search);