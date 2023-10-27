const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// parse JSON
app.use(express.json());

const username = 'your_username'; // Replace with your DataForSEO username
const password = 'your_password'; // Replace with your DataForSEO password

app.post('/api/search', (req, res) => {
  try {
    const location = req.body.location_name;
    const keyword = req.body.keyword;

    const post_array = [
      {
        "location_name": location,
        "language_name": "English",
        "keyword": encodeURI(keyword),
        "depth": 50,
      }
    ];

    axios({
      method: 'post',
      url: 'https://api.dataforseo.com/v3/business_data/google/reviews/task_post',
      auth: {
        username: username,
        password: password,
      },
      data: post_array,
      headers: {
        'content-type': 'application/json',
      }
    }).then(function (response) {
      var result = response.data.tasks; // response.data, not response['data']
      res.json(result); // Send the result to the client
    }).catch(function (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
