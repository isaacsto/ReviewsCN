nextToken = null;
let dataId = null;
let reviewsData = [];
let previousReviewsData = [];
let nextParams;
let newDataFetched = false;
let currentIndex = 0; 

document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  localStorage.removeItem('reviewsData');
  nextToken = null;
  const location = document.getElementById('locationInput').value;
  const keyword = document.getElementById('keywordInput').value;
  fetch(`/api/search/google_maps?dataId=${location}&keyword=${keyword}`, {
    method: 'GET'
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      if (data.place_results) {
        dataId = data.place_results.data_id;
      } else if (data.local_results) {
        dataId = data.local_results[0].data_id;
      }
      // fetch reviews
      fetchReviews(dataId); 

    })
  
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

function saveToLocalStorage(data) {
  let reviews = loadFromLocalStorage();
  if (!Array.isArray(reviews)) {
    reviews = []; 
  }
  reviews.push(data);
  localStorage.setItem('reviewsData', JSON.stringify(reviews));
}

function loadFromLocalStorage() {
  return JSON.parse(localStorage.getItem('reviewsData')) || [];
}

function getReviewsByIndex(){
  const reviews = loadFromLocalStorage();
  currentIndex--;
  if (reviews.length >= 0) {
    const review = reviews[currentIndex];
    appendData(review);
  } else {
    currentIndex = 0;
  }
}

function fetchReviews(dataId) {
  fetch(`/api/search/google_maps_reviews?dataId=${dataId}`, {
    method: "post",
    body: JSON.stringify({ nextParams }),
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then(response => response.json())
    .then(reviewsData => {
      console.log(reviewsData);
     
      nextToken = reviewsData.next_page_token;
      appendData(reviewsData);
      saveToLocalStorage(reviewsData);
      
    })
    .catch(error => {
      console.error('Error fetching reviews data:', error);
    })

};


function appendData(reviewsData) {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = '';

  if ((reviewsData && reviewsData.reviews && Array.isArray(reviewsData.reviews))) {
    const reviews = reviewsData.reviews;

    if (reviews.length > 0) {
      for (let i = 0; i < reviews.length; i++) {
        const reviewDiv = document.createElement("div");
        reviewDiv.classList.add("review-card");

        const rating = parseInt(reviews[i].rating);
        const comment = reviews[i].snippet || "No comment provided";
        const date = reviews[i].date;
        //reviews - star svg 
        const starSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        starSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        starSVG.setAttribute("viewBox", "0 0 24 24");
        starSVG.setAttribute("width", "24");
        starSVG.setAttribute("height", "24");

        const starPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        starPath.setAttribute("d", "M12 2 L14.26 8.15 L21.56 9.24 L16.72 14.21 L17.82 21.51 L12 18.77 L6.18 21.51 L7.28 14.21 L2.44 9.24 L9.74 8.15 Z");
        starPath.setAttribute("fill", "#FF7F30");

        starSVG.appendChild(starPath);

        let starsHTML = '';
        for (let j = 0; j < rating; j++) {
          starsHTML += starSVG.outerHTML;
        }

        reviewDiv.innerHTML = `
        <div class="accordion">
        <br><strong>${starsHTML} </strong> <br> <br>
         <p>${date}</p> <br> <br> <br>
         </div>
         <div class="panel">
         <p>${comment}</p> <br> <br>
         </div>
         `;
        //js for accordion
        document.getElementById('result').appendChild(reviewDiv);
        reviewDiv.querySelector('.accordion').addEventListener('click', function () {
          this.classList.toggle("active");
          var panel = this.nextElementSibling;
          if (panel.style.display === "block") {
            panel.style.display = "none";
          } else {
            panel.style.display = "block";
          }
        });

      }
      newDataFetched = true;
  } else {
    displayNoReviewsMessage(); 
  }
}
}; 

function fetchNextPage() {
  fetch(`/api/search/google_maps_reviews?dataId=${dataId}&next_page_token=${nextToken}`, {
    method: "post",
    body: JSON.stringify({ nextParams }),
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then(response => response.json())
    .then(reviewsData => {
  

  
      nextToken = reviewsData.next_page_token;
      console.log(nextToken);
      appendData(reviewsData);
      saveToLocalStorage(reviewsData);
      currentIndex++;
    }) 
    
    .catch(error => {
      console.error('Error fetching reviews data:', error);
    });

};
function displayNoReviewsMessage() {
  const reviewsContainer = document.getElementById('result');
  reviewsContainer.innerHTML = '<p>No reviews available.</p>';
}

function fetchPreviousPage() {
  if (newDataFetched && previousReviewsData) {
    appendPrevData(previousReviewsData);
  } else {
    console.error('No previous reviews data found');
  }

}

document.getElementById('next-page-top').addEventListener('click', function () {
  fetchNextPage();
});

document.getElementById('back-button').addEventListener('click', function () {
 getReviewsByIndex();
});