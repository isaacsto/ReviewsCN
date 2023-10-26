const APIkey = "fa1466ca45b9512163934cab2e61863118ced546a3ee33f1fc9185c46a5f16a1";
const reviews = [];
let companyName = "";

var searchButtonEl = document.querySelector('#search-button');

searchButtonEl.addEventListener('click', function (event) { 
    event.preventDefault();

    let companyName = document.getElementById('search-input').value;    
    console.log(companyName);

});

function searchCompany(companyName) {

    let searchValue = document.getElementById("companyName").value;
    if (searchValue === "") {
        alert("Please enter a company name");
        return;
    }

}

function getReviews() {
    var reviewsUrl = "https://serpapi.com/search.json?q=" + companyName + "&api_key=" + APIkey;

    var reviews = $('.reviews')

    fetch(reviewsUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        console.log(data);
        reviews.empty();
        for (var i = 0; i < data.length; i++) {
            var review = data[i].review;
            var reviewEl = $('<p>').text(review);
            reviews.append(reviewEl);
        }
    })
}
