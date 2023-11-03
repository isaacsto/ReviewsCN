document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const location = document.getElementById('locationInput').value;
  const keyword = document.getElementById('keywordInput').value;

  // Send the data to the first API endpoint
  fetch('http://localhost:3000/api/search', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
   
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      document.getElementById('result').textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Send the data to the second API endpoint
  fetch('http://localhost:3000/api/search/google_maps_reviews', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
   
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      
      document.getElementById('result2').textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

  