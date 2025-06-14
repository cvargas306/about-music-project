// src/js/lastfm.js
import { fetchData } from './utils.mjs';

// IMPORTANT: Replace with your actual Last.fm API Key
// For development, you can put it directly here for quick testing,
// but for production, use a .env variable as shown below.
// const LASTFM_API_KEY = 'YOUR_LASTFM_API_KEY';

// Using Vite's environment variables:
// Make sure to create a .env file at the project root:
// VITE_LASTFM_API_KEY=YOUR_LASTFM_API_KEY
const LASTFM_API_KEY = import.meta.env.VITE_LASTFM_API_KEY;

const LASTFM_BASE_URL = 'http://ws.audioscrobbler.com/2.0/';

export async function getArtistInfo(artistName) {
    if (!LASTFM_API_KEY) {
        throw new Error('Last.fm API Key is not configured. Please add VITE_LASTFM_API_KEY to your .env file.');
    }

    const url = new URL(LASTFM_BASE_URL);
    url.searchParams.append('method', 'artist.getinfo');
    url.searchParams.append('artist', artistName);
    url.searchParams.append('api_key', LASTFM_API_KEY);
    url.searchParams.append('format', 'json');

    try {
        const data = await fetchData(url.toString());
        console.log('Last.fm Artist Info:', data);

        if (data.error) {
            throw new Error(data.message || `Last.fm API error: ${data.error}`);
        }

        if (!data.artist || !data.artist.bio || !data.artist.bio.summary) {
            throw new Error(`Artist "${artistName}" not found or no bio available.`);
        }

        // Extract relevant info
        return {
            name: data.artist.name,
            bio: data.artist.bio.summary.split('<a')[0] + '...', // Clean up the bio summary
            image: data.artist.image.find(img => img.size === 'large' || img.size === 'extralarge') || data.artist.image[0]
        };
    } catch (error) {
        console.error('Error fetching artist info from Last.fm:', error);
        throw error; // Re-throw to be handled by the caller (main.js)
    }
}

// You can add more Last.fm functions here (e.g., getTopTracks, getAlbumInfo)