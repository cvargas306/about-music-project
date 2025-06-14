import { fetchData } from './utils.mjs'; // Example import
import { getArtistInfo } from './lastfm.js'; // Example import

console.log('main.js loaded!');

// Get DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const chordsDisplay = document.getElementById('chordsDisplay');
const lyricsDisplay = document.getElementById('lyricsDisplay');
const artistInfoDisplay = document.getElementById('artistInfoDisplay');

// Add event listener for search button
searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Please enter a song title or artist name.');
        return;
    }

    console.log(`Searching for: ${query}`);

    // Placeholder for API calls
    chordsDisplay.innerHTML = `<p>Searching chords for "${query}"...</p>`;
    lyricsDisplay.innerHTML = `<p>Searching lyrics for "${query}"...</p>`;
    artistInfoDisplay.innerHTML = `<p>Searching artist info for "${query}"...</p>`;

    // Example of calling a placeholder function from lastfm.js
    try {
        const artistData = await getArtistInfo(query);
        artistInfoDisplay.innerHTML = `<h3>Artist: <span class="math-inline">\{artistData\.name\}</h3\><p\></span>{artistData.bio}</p>`;
    } catch (error) {
        artistInfoDisplay.innerHTML = `<p class="error-message">Error fetching artist info: ${error.message}</p>`;
        console.error('Error in main.js fetching artist info:', error);
    }

    // TODO: Integrate actual API calls here for chords and lyrics
});