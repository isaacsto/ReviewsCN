const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const { getJson } = require("serpapi"); // Import getJson once

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// parse JSON
app.use(express.json());

// Path to client folder
app.use(express.static(path.join(__dirname, '../client')));

// Path to HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Path to env/api key
require('dotenv').config();
const API_key = process.env.API_key;

// Call general search to get data id
app.get('/api/search', (req, res) => {
  try {
    getJson({
      api_key: API_key,
      engine: "google",
      q: req.query.keyword,
      location: req.query.location,
      google_domain: "google.com",
      gl: "us",
      hl: "en"
    }, (json) => {
      console.log(json["reviews_results"]);

    }).catch(function (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while fetching reviews data.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.', details: error.message });
  }
});


/*
      const dataId = json["id"];

      // define new route for fetching reviews
      app.get(`/api/search/google_maps_reviews`, (req, res) => {
        try {
          getJson({
            api_key: API_key,
            engine: "google_maps_reviews",
            data_id: dataId,
            hl: "en"
          }, (reviewsJson) => {
            console.log(reviewsJson["reviews_results"]);
            res.json(reviewsJson);
          }).catch(function (error) {
            console.log(error);
            res.status(500).json({ error: 'An error occurred while fetching reviews data.' });
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred while processing the request.', details: error.message });
        }
      });

      res.json(json);
    }).catch(function (error) {
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




/* const express = require('express');
const app = express();
const path = require('path');
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

//path to client folder 
app.use(express.static(path.join(__dirname, '../client')));

//path to html 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

//path to env/api key 
require('dotenv').config(); 
const API_key = process.env.API_key

//call general search to get data id 
const { getJson } = require("serpapi");
app.get('/api/search', (req, res) => {
  try {
    getJson({
      api_key: API_key,
      engine: "google",
      q: req.query.keyword,
      location: req.query.location,
      google_domain: "google.com",
      gl: "us",
      hl: "en"
        

    }, (json) => {
      console.log(json["reviews_results"]);
      //store data id in const 
      const dataId = json["id"];

 
      //hit reviews endpoint 
      app.get(`/api/search/google_maps_reviews&data_id=${dataId}`, (req, res) => {
        try {
          getJson({
            api_key: API_key,
            engine: "google_maps_reviews",
            data_id: dataId,
            hl: "en"
          }, (json) => {
            console.log(json["reviews_results"]);
            res.json(json); 
          }).catch(function (error) {
            console.log(error);
            res.status(500).json({ error: 'An error occurred while fetching reviews data.' });
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred while processing the request.', details: error.message });
        }
      });


      res.json(json);
    }).catch(function (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.', details: error.message });
  }
});

const { getJson } = require("serpapi");

getJson({

}, (json) => {
  console.log(json);
});

const { getJson } = require("serpapi");

getJson({
 
}, (json) => {
  console.log(json);
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
*/