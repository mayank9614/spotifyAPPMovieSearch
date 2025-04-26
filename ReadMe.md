# Spotify Movie Playlist Search

A modern application to search for movie playlists on Spotify with a sleek, Spotify-inspired UI.

## Features

- Modern Spotify-inspired user interface
- Search for playlists related to movie names
- Responsive design that works on desktop and mobile devices
- Recent searches history
- Error handling with user-friendly messages
- Playlist cards with play button overlays
- Loading animations and visual feedback

## Technical Details

This application is built with:
- Node.js and Express for the backend
- Vanilla JavaScript, HTML, and CSS for the frontend
- Spotify Web API for playlist data

## Deployment Instructions

### Option 1: Deploy to Azure Static Web Apps

1. Download the `spotify-movie-search.zip` file
2. Extract the contents
3. In the Azure Portal, navigate to your Static Web App
4. Go to the "Deployment" section
5. Upload the extracted files or connect to your GitHub repository
6. Configure the build settings if necessary
7. Deploy the application

### Option 2: Run Locally

1. Download and extract the `spotify-movie-search.zip` file
2. Navigate to the extracted directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000`

## API Configuration

The application uses the Spotify Web API with the following credentials:


If you need to use your own Spotify API credentials:
1. Create a Spotify Developer account at [developer.spotify.com](https://developer.spotify.com)
2. Create a new application to get your Client ID and Client Secret
3. Update the credentials in `server.js`

## Troubleshooting

If you encounter connection issues with the Spotify API:
1. Check your internet connection
2. Verify that the Spotify API is operational
3. Ensure your API credentials are correct
4. Check for any CORS issues if running locally

## License

This project is open source and available for personal and commercial use.
