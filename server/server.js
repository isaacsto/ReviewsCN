const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3002;

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

//path to js 
/*app.get('/script.js', (req, res) => {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, '../client/script.js'));
}); */

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
      engine: "google_maps",
      api_key: API_key,
      q: req.query.keyword,
      location: req.query.location,
    }, (json) => {
      console.log(json["reviews_results"]);
      //store data id in const 
      const dataId = json["data_id"];

 
      //hit reviews endpoint 
      app.get(`/api/search/google_maps_reviews`, (req, res) => {
        try {
          getJson({
            engine: "google_maps_reviews",
            reviews: "1",
            gl: "us",
            hl: "en",
            data_id: dataId,
            api_key: API_key,
            q: req.query.keyword,
            location: req.query.location,
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


app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});

