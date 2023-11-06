/*document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const location = document.getElementById('locationInput').value;
  const keyword = document.getElementById('keywordInput').value;



  // Send the data to the first API endpoint
  fetch('/api/search', {
    method: 'GET',
  })
    .then(response => response.json()
    .then(data => {
      const dataId = data.id; 
    })
    )

    fetch(`/api/google_maps_reviews?dataId=${dataId}`)
    .then(response => response.json())
    .then(reviewsData => {
      console.log(reviewsData.reviews_results);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
  });  
  /*
    // Send the data to the second API endpoint
  fetch( `/api/google-maps-reviews`, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

*/