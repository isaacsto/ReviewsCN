document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const location = document.getElementById('locationInput').value;
  const keyword = document.getElementById('keywordInput').value;

  // Send the data to the server
  fetch('http://localhost:3000/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ location, keyword }),
  })
    .then(response => response.json())
    .then(data => {
      
      document.getElementById('result').textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});