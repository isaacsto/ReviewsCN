let nextToken = "xyz";
let dataId = null;
let reviewsData = [];
let chartData = [];
let myChart; 
let nextUrl = null;

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
  fetch(`/api/search/google_maps_reviews?dataId=${dataId}`)
    .then(response => response.json())
    .then(reviewsData => {
      console.log(reviewsData);
      nextUrl = reviewsData.nextUrl;

      // nextToken = reviewsData.next_page_token;
      appendData(reviewsData);
    })
    .catch(error => {
      console.error('Error fetching reviews data:', error);
    })

};

function fetchNextPage() {

  // nextToken = nextToken.split("");
  // nextToken.splice(nextToken.length - 2, 2);
  // nextToken = nextToken.join("");
  // console.log(nextToken)

  fetch(`/api/search/google_maps_reviews?dataId=${dataId}&next_page_token=${nextUrl}`)
    .then(response => response.json())
    .then(reviewsData => {
      appendData(reviewsData);

      // nextToken = reviewsData.next_page_token;
      nextUrl = reviewsData.nextUrl;
    })
    .catch(error => {
      console.error('Error fetching reviews data:', error);
    });

};

function appendData(reviewsData) {
  if (reviewsData && reviewsData.reviews && Array.isArray(reviewsData.reviews)) {
    const reviews = reviewsData.reviews;

    if (reviews.length > 0) {
      for (let i = 0; i < reviews.length; i++) {
        const reviewDiv = document.createElement("div");

        const rating = reviews[i].rating;
        const comment = reviews[i].snippet;
        const date = reviews[i].date;

        reviewDiv.innerHTML = `
      <br><strong>Rating:</strong> ${rating} <br> <br>
      <strong>Comment:</strong> ${comment} <br> <br>
      <strong>Date:</strong> ${date} <br> <br> <br>
    `;

        document.getElementById('result').appendChild(reviewDiv);
      }
    } else {
      console.warn('No reviews found in reviewsData:', reviewsData);
    }
  } else {
    console.error('Unexpected data structure in reviewsData:', reviewsData);
  } 
  const newReviews = reviewsData.reviews;
  const newChartData = newReviews.map(review => ({
      x: review.date,
      y: review.rating,
    }));
    
    chartData = chartData.concat(newChartData);
    
   
    createLineChart(chartData);
}

function extractChartData(reviewsData) {

  return reviewsData.reviews.map(review => ({
    x: review.date,
    y: review.rating,
  }));
}


function createLineChart(chartData) {
  if (myChart) {
   
    myChart.destroy();
  }

   
  const ctx = document.getElementById('chart').getContext('2d');

const chartOptions = {
    scales: {
      y: {
        beginAtZero: true
      },
        x: {
            reverse: true  
        }
    }
};
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Rating over Time',
        data: chartData,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
      }],
    },
    options: chartOptions
  });
}

document.getElementById('next-page').addEventListener('click', function () {
  fetchNextPage();
});
document.getElementById('next-page-top').addEventListener('click', function () {
  fetchNextPage();
});
