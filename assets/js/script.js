var cityInput = '';
var cityInputData = {};

// var createResultElements = function() {

// };

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
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + '&appid=3a01189ad2669a4fe12bba52ee8f9ead';
    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(response){
        cityInputData = response;
        displayResults(cityInputData);
    });
};

// var displayResults = function(cityData) {
    
//     console.log('js28', cityData);
// };

var defaultStartup = function() {
    // createResultElements();

    var defaultApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=paris&appid=3a01189ad2669a4fe12bba52ee8f9ead';
    fetch(defaultApiUrl)
    .then(function(parisData) {
        return parisData.json();
    })
    .then(function(parisData){
        displayResults(parisData);
    });
};

defaultStartup();
$('.form').on('submit', search);