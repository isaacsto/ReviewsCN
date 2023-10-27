const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Middleware to parse JSON data
app.use(express.json());

var key=""
// POST route for searching the company
app.post('/searchCompany', async (req, res) => {
    const { companyName } = req.body;

    try {
        if (!companyName) {
            return res.status(400).json({ error: 'Please provide a company name.' });
        }

        const serpApiUrl = `https://serpapi.com/search.json?q=${companyName}&api_key=${key}`; // Replace with your API key
        const response = await axios.get(serpApiUrl);
        const data = response.data;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});
