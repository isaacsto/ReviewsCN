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

const API_key = process.env.API_key

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
      const dataId = json["data_id"];

 

      app.get(`/api/search/google_maps_reviews`, (req, res) => {
        try {
          getJson({
            engine: "google_maps_reviews",
            reviews: "1",
            gl: "us",
            hl: "en",
            data_id: dataId,
            api_key: "48bca7f6206c2d414b2835e76cc154e8fce94bc54c60fe38396f241603226501",
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

