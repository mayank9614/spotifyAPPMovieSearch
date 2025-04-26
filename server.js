const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));

// Spotify API credentials
const CLIENT_ID = 'cd73ebdde5714a1cb42331c146cdb96e';
const CLIENT_SECRET = 'afde5bb5a16049d885aa13e93f5187de';

app.get('/search', async (req, res) => {
  try {
    const movieName = req.query.movie;
    
    if (!movieName) {
      return res.status(400).json({ error: 'Movie name is required' });
    }

    // Get access token
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials', 
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const accessToken = tokenResponse.data.access_token;
    
    // Search for playlists with the movie name
    const searchResponse = await axios.get(`https://api.spotify.com/v1/search?q=${movieName}&type=playlist`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    res.json(searchResponse.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from Spotify' });
  }
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
