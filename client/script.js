let nextToken = null;
let dataId = null;
let reviewsData = [];
let chartData = [];
//let myChart; 
let nextParams;

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

      nextToken = reviewsData.next_page_token;
      nextParams = reviewsData.nextParams;
      appendData(reviewsData);
    })
    .catch(error => {
      console.error('Error fetching reviews data:', error);
    })

};


function appendData(reviewsData) {
  if (reviewsData && reviewsData.reviews && Array.isArray(reviewsData.reviews)) {
    const reviews = reviewsData.reviews;

    if (reviews.length > 0) {
      for (let i = 0; i < 10; i++) {
        const reviewDiv = document.createElement("div");
        reviewDiv.classList.add("review-card");


        const rating = parseInt(reviews[i].rating);
        const comment = reviews[i].snippet;
        const date = reviews[i].date;

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
         <strong>Comment:</strong> ${comment} <br> <br>
         </div>
    `;

        document.getElementById('result').appendChild(reviewDiv);
        accordion()
      }
    } else {
      console.warn('No reviews found in reviewsData:', reviewsData);
    }
  } else {
    console.error('Unexpected data structure in reviewsData:', reviewsData);
  }

  function replaceData(reviewsData) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';

    if (reviewsData && reviewsData.reviews && Array.isArray(reviewsData.reviews)) {
      const reviews = reviewsData.reviews;

      if (reviews.length > 0) {
        for (let i = 0; i < 10; i++) {
          const reviewDiv = document.createElement("div");
          reviewDiv.classList.add("review-card");

          const rating = parseInt(reviews[i].rating);
          const comment = reviews[i].snippet;
          const date = reviews[i].date;

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
          <br><strong>${starsHTML}</strong><br> <br>
           <p>${date}</p> <br> <br> <br>
           </div>
           <div class="panel">
           <strong>Comment:</strong> ${comment} <br> <br>
           </div>
        `;
          

          resultContainer.appendChild(reviewDiv);
          accordion()
        }
      } else {
        console.warn("No reviews found in reviewsData:", reviewsData);
      }
    } else {
      console.error("Unexpected data structure in reviewsData:", reviewsData);
    }
  }

  function fetchNextPage() {

    // nextToken = nextToken.split("");
    // nextToken.splice(nextToken.length - 2, 2);
    // nextToken = nextToken.join("");
    // console.log(nextToken)

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
        replaceData(reviewsData);

      })
      .catch(error => {
        console.error('Error fetching reviews data:', error);
      });

  };

function accordion() {
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {

      this.classList.toggle("active");

      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
}

  document.getElementById('next-page-top').addEventListener('click', function () {
    fetchNextPage();
  });
}