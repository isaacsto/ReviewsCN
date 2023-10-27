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

var key="fa1466ca45b9512163934cab2e61863118ced546a3ee33f1fc9185c46a5f16a1"

app.post('/searchCompany', async (req, res) => {
    const { companyName } = req.body;

    try {
        if (!companyName) {
            return res.status(400).json({ error: 'Please provide a company name.' });
        }

        const post_array = [];
post_array.push({
  "location_name": "London,England,United Kingdom",
  "language_name": "English",
  "keyword": encodeURI("hedonism wines"),
  "depth": 50,
});
const axios = require('axios');
axios({
  method: 'post',
  url: 'https://api.dataforseo.com/v3/business_data/google/reviews/task_post',
  auth: {
    username: 'login',
    password: 'password'
  },
  data: post_array,
  headers: {
    'content-type': 'application/json'
  }
}).then(function (response) {
  var result = response['data']['tasks'];
  // Result data
  console.log(result);
}).catch(function (error) {
  console.log(error);
});

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
}); 





app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});
