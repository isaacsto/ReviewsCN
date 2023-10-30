
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


require('dotenv').config(); 
const API_key = process.env.API_KEY;




app.post('/api/search', (req, res) => {
  try {
    const keyword = req.body.keyword; 
    const location = req.body.location;

    getJson({
      engine: "google_product",
      q: keyword,
      location: location, 
      reviews: "1",
      gl: "us",
      hl: "en",
      api_key: API_key, 
    }, (json) => {
      console.log(json["reviews_results"]);
    });

    axios({
      method: 'post',
      url: 'https://serpapi.com/search.json?engine=google_product&product_id=4172129135583325756&reviews=1&gl=us&hl=en',
       auth: {
        username: API_key,
        password: '',
      }, 
      data: post_array,
      headers: {
        'content-type': 'application/json',
      }
    }).then(function (response) {
      var result = response['data']['tasks'];
      res.json(result); 
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

