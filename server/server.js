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


app.get('/api/search', (req, res) => {
  try {
    const { getJson } = require("serpapi");
    getJson({
      engine: "google",
      api_key: API_key,
      q: req.query.keyword, // Add this line to include the keyword from the client
      location: req.query.location, // Add this line to include the location from the client
    }, (json) => {
      console.log(json["data_id"]);
    })
    .then(function (response) {
      // Save the JSON response from SerpApi in a variable
      const result = response;

      // Pass the result to res.json
      res.json(result);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

app.get('/api/search/google_maps_reviews', (req, res) => {
  try {
    const { getJson } = require("serpapi");
    getJson({
      engine: "google_maps_reviews",
      reviews: "1",
      gl: "us",
      hl: "en",
      api_key: API_key,
      q: req.query.keyword, // Add this line to include the keyword from the client
      location: req.query.location, // Add this line to include the location from the client
    }, (json) => {
      console.log(json["reviews_results"]);
    })
    .then(function (response) {
      // Save the JSON response from SerpApi in a variable
      const result = response;

      // Pass the result to res.json
      res.json(result);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.', details: error.message });
  }
});


app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});

