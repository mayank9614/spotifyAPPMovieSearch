const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.static('public')); // Serve static files from the 'public' directory

app.get('/search', async (req, res) => {
    const movieName = req.query.movie;
    // Spotify API logic will go here
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
