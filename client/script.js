let nextToken = null;
let dataId = null;
let reviewsData = [];
let previousReviewsData = [];
let nextParams;
let newDataFetched = false;

document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const location = document.getElementById('locationInput').value;
  const keyword = document.getElementById('keywordInput').value;
  fetch(`/api/search/google_maps?dataId=${location}&keyword=${keyword}`, {
    method: 'GET'
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      dataId = data.place_results.data_id;
      // fetch reviews
      fetchReviews(dataId)

    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});


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

      localStorage.setItem('reviewsData', JSON.stringify(reviewsData));

      nextToken = reviewsData.next_page_token;
      nextParams = reviewsData.nextParams;
      appendData(reviewsData);
      newDataFetched = true;
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
      console.warn('No reviews found in reviewsData:', reviewsData);
    }
  } else {
    console.error('Unexpected data structure in reviewsData:', reviewsData);
  }
}

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
      replaceData(reviewsData);

    })
    .catch(error => {
      console.error('Error fetching reviews data:', error);
    });

};

function replaceData(reviewsData) {
  if ((reviewsData && reviewsData.reviews && Array.isArray(reviewsData.reviews))) {
    appendData(reviewsData);
  } else {
    console.warn('No reviews found in reviewsData:', reviewsData);
  }
}

function fetchPrevPage(previousReviewsData) {  
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = '';

  previousReviewsData = JSON.parse(localStorage.getItem('reviewsData'));

  if (previousReviewsData && previousReviewsData.reviews && Array.isArray(previousReviewsData.reviews)) {
    appendPrevData(previousReviewsData);
  } else {
    console.error('No previous reviews data found');
  }

}

function appendPrevData(previousReviewsData) {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = '';

  previousReviewsData = JSON.parse(localStorage.getItem('reviewsData'));

  if ((previousReviewsData && previousReviewsData.reviews && Array.isArray(previousReviewsData.reviews))) {
    const previousReviews = previousReviewsData.reviews;

    if (previousReviews.length > 0) {
      for (let i = 0; i < 10; i++) {
        const prevReviewDiv = document.createElement("div");
        prevReviewDiv.classList.add("review-card");

        const rating = parseInt(previousReviewsData.reviews[i].rating);
        const comment = previousReviewsData.reviews[i].snippet || "No comment provided";
        const date = previousReviewsData.reviews[i].date;
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

        prevReviewDiv.innerHTML = `
        <div class="accordion">
        <br><strong>${starsHTML} </strong> <br> <br>
         <p>${date}</p> <br> <br> <br>
         </div>
         <div class="panel">
         <p>${comment}</p> <br> <br>
         </div>
         `;
        //js for accordion
        document.getElementById('result').appendChild(prevReviewDiv);
        prevReviewDiv.querySelector('.accordion').addEventListener('click', function () {
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
      console.warn('No reviews found in reviewsData:', reviewsData);
    }
  } else {
    console.error('Unexpected data structure in reviewsData:', reviewsData);
  }
}


document.getElementById('next-page-top').addEventListener('click', function () {
  fetchNextPage();
});

document.getElementById('back-button').addEventListener('click', function () {
  fetchPrevPage();
});