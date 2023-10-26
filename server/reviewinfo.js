const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/reviews', (req, res) => {
    const companyName = req.query.companyName;
    const key = 'fa1466ca45b9512163934cab2e61863118ced546a3ee33f1fc9185c46a5f16a1'
    const serpApiUrl = `https://serpapi.com/search.json?q=site:yoursite.com+${companyName}&api_key=${key}`;

    axios.get(serpApiUrl)
        .then(response => {
            const searchResults = response.data;
            if (searchResults.organic_results.length > 0) {
                const firstResult = searchResults.organic_results[0];
                const totalReviews = firstResult.review_count || 'N/A';
                const averageRating = firstResult.review_rating || 'N/A';
                res.json({ totalReviews, averageRating });
            } else {
                res.json({ totalReviews: 'N/A', averageRating: 'N/A' });
            }
        })
        .catch(error => {
            console.error('Error making the API request:', error);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
