require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const { getJson, config } = require("serpapi"); 


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
app.use(express.static(path.join(__dirname, "../client")));

// Serve HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html")); // Adjust the path
});

// Load API_key

const API_key = process.env.API_key;



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
app.post("/api/search/google_maps_reviews", (req, res) => {
  const keyword = req.query.keyword;
  const dataId = req.query.dataId;
  const next_page_token = req.query.nextToken; 
  //const nextPageUrl = req.query.nextUrl;
  console.log(req.query);

 let params = {
    api_key: API_key,
    engine: "google_maps_reviews",
    data_id: dataId,
    q: keyword,
    hl: "en",
    sort_by: "newestFirst",
   next_page_token: next_page_token? next_page_token : "", 
  }
  if (req.body.nextParams) {
    params = req.body.nextParams
    params.api_key = API_key
  }
  getJson(params)
    .then((reviewsJson) => {
      const {reviews} = reviewsJson;
    
      //console.log("reviews",reviewsJson); 
      //res.json({reviews, next_page_token:reviewsJson?.serpapi_pagination?.next_page_token});
      const nextUrl = new URL(reviewsJson.serpapi_pagination.next)
      const nextParams = Object.fromEntries(nextUrl.searchParams)
      console.log(nextParams);
      
      res.json({reviews, nextParams})
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
})