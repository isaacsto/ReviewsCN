var searchButtonEl = document.querySelector('#search-button');

searchButtonEl.addEventListener('click', function (event) { 
    event.preventDefault();

    var companyName = document.getElementById('search-input').value;    
    console.log(companyName);

});