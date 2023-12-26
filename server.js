const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


//app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cors());

app.get('/search', async (req, res) => {
    const movieName = req.query.movie;
    const CLIENT_ID = 'cd73ebdde5714a1cb42331c146cdb06e';
    const CLIENT_SECRET = 'afde5bb5a16049d885aa13e93f5187de';

const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

try {
    // Get access token
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const accessToken = tokenResponse.data.access_token;

    // Search for playlists with the movie name
    const searchResponse = await axios.get(`https://api.spotify.com/v1/search?q=${movieName}&type=playlist`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    res.json(searchResponse.data);
} catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Spotify' });
}

});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
