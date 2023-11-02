const express = require('express');
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

app.use(express.static('../client/index.html'));

require('dotenv').config(); 
const API_key = process.env.API_key;


  app.get('https://serpapi.com/search', (req, res) => {
    try {
      
      const { getJson } = require("serpapi");
      getJson({
        engine: "google",
        api_key: API_key,
      }, (json) => {
        console.log(json["data_id"]);
  
      
      }).then(function (response) {
        var result = response.data.tasks
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

app.post('https://serpapi.com/search?engine=google_maps_reviews', (req, res) => {
  try {
    
    const { getJson } = require("serpapi");
    getJson({
      engine: "google_maps_reviews",
      reviews: "1",
      gl: "us",
      hl: "en",
      api_key: API_key, 
    }, (json) => {
      console.log(json["reviews_results"]);

    
    }).then(function (response) {
      var result = response.data.tasks
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

