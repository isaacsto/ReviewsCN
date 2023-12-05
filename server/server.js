require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const { getJson } = require("serpapi"); // Import getJson once

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Parse JSON
app.use(express.json());

// Serve static files from "client"
app.use(express.static(path.join(__dirname, "client")));

// Serve HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html")); // Adjust the path
});

// Load API_key

const API_key = process.env.API_key;
console.log(process.env);

// Define a route for searching and fetching data
app.get("/api/search", (req, res) => {
  const location = req.query.location;
  const keyword = req.query.keyword;

  if (!location || !keyword) {
    return res.status(400).json({ error: "Location and keyword are required" });
  }

  getJson({
    api_key: API_key,
    engine: "google",
    q: keyword,
    location: location,
    google_domain: "google.com",
    gl: "us",
    hl: "en",
  })
    .then((json) => {
      res.json(json);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    });
});

// Define a route for maps
app.get("/api/search/google_maps", (req, res) => {
  const keyword = req.query.keyword;
  console.log(keyword);

  getJson({
    api_key: API_key,
    engine: "google_maps",
    q: keyword,
    type: "search",
    google_domain: "google.com",
  })
    .then((json) => {
      res.json(json);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    });
});

// Define a route for fetching reviews
app.get("/api/search/google_maps_reviews", (req, res) => {
  const keyword = req.query.keyword;
  const dataId = req.query.dataId;


  getJson({
    api_key: API_key,
    engine: "google_maps_reviews",
    data_id: dataId,
    q: keyword,
    hl: "en",
  })
    .then((reviewsJson) => {
      console.log(reviewsJson["reviews_results"]);
      res.json(reviewsJson);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching reviews data." });
    });
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
