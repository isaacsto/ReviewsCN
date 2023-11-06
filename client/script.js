document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const location = document.getElementById('locationInput').value;
  const keyword = document.getElementById('keywordInput').value;

  // Send the data to the first API endpoint
  fetch(`http://localhost:3000/api/search?location=${location}&keyword=${keyword}`, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });


  // Send the data to the second API endpoint
  fetch(`http://localhost:3000/api/search/google_maps_reviews?location=${location}&keyword=${keyword}`, {
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


