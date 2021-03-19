var search = function(event) {
    event.preventDefault();
    searchInput = $('#search-input').val();
    console.log('js4', searchInput);
};

$('#form').on('submit', search);