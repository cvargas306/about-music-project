import { fetchData } from './utils.mjs';
import { getArtistInfo } from './lastfm.js';
import { getLyrics } from './lyrics.js';
//import { getChordOrScale } from './chords.js'; 

console.log('main.js loaded!');

const artistInput = document.getElementById('artistInput');
const songInput = document.getElementById('songInput');
const searchButton = document.getElementById('searchButton');
const chordsDisplay = document.getElementById('chordsDisplay'); 
const lyricsDisplay = document.getElementById('lyricsDisplay');
const artistInfoDisplay = document.getElementById('artistInfoDisplay');


//const chordScaleInput = document.getElementById('chordScaleInput');
// const chordScaleButton = document.getElementById('chordScaleButton');
// const chordScaleResults = document.getElementById('chordScaleResults');

console.log('VITE_LASTFM_API_KEY from .env:', import.meta.env.VITE_LASTFM_API_KEY);
// Removed duplicate 'main.js loaded!' log here

// --- Event Listener for Main Artist/Song Search ---
searchButton.addEventListener('click', async () => {
    const artistQuery = artistInput.value.trim();
    const songQuery = songInput.value.trim();

    // Input Validation
    if (!artistQuery && !songQuery) {
        alert('Please enter an Artist Name or a Song Title to search.');
        return;
    }

    console.log(`Searching for Artist: "${artistQuery}", Song: "${songQuery}"`);

    // --- Initial Display Placeholders / Loading Messages ---
    // Note: The `chordsDisplay` here refers to the main section,
    // not the specific chordScaleResults for individual lookups.
    artistInfoDisplay.innerHTML = `<p>Searching artist info for "${artistQuery || '...'}"...</p>`;
    // CORRECTED: Removed math-inline span tags, fixed interpolation syntax
    lyricsDisplay.innerHTML = `<p>Searching lyrics for "${songQuery || '...'}" by "${artistQuery || '...'}"...</p>`;
    chordsDisplay.innerHTML = `<p>Searching song chords for "${songQuery || '...'}" by "${artistQuery || '...'}" (Not supported by API directly)...</p>`;


    // --- Fetch Artist Information (using Last.fm API) ---
    // This block is the correct one. The duplicate was removed.
    if (artistQuery) {
        try {
            const artistData = await getArtistInfo(artistQuery);
            artistInfoDisplay.innerHTML = `<h3>Artist: ${artistData.name}</h3><p>${artistData.bio}</p>`;
        } catch (error) {
            artistInfoDisplay.innerHTML = `<p class="error-message">Error fetching artist info: ${error.message}</p>`;
            console.error('Error in main.js fetching artist info:', error);
        }
    } else {
        artistInfoDisplay.innerHTML = `<p>Enter an artist name to display artist information here.</p>`;
    }


    // --- Fetch Lyrics (using Lyrics.ovh API) ---
    if (artistQuery && songQuery) {
        try {
            const lyricsText = await getLyrics(artistQuery, songQuery);
            lyricsDisplay.innerHTML = `<h4>Lyrics:</h4><pre>${lyricsText}</pre>`; // <pre> preserves formatting
        } catch (error) {
            lyricsDisplay.innerHTML = `<p class="error-message">Error fetching lyrics: ${error.message}</p>`;
            console.error('Error in main.js fetching lyrics:', error);
        }
    } else if (!songQuery && artistQuery) {
        lyricsDisplay.innerHTML = `<p>Enter a song title in addition to "${artistQuery}" to get lyrics.</p>`;
    } else if (!artistQuery && songQuery) {
        lyricsDisplay.innerHTML = `<p>Enter an artist name in addition to "${songQuery}" to get lyrics.</p>`;
    } else {
        lyricsDisplay.innerHTML = `<p>Enter both an artist name and song title to get lyrics here.</p>`;
    }


    // --- Display Message for Song Chords/Tabs (Not from API, but for context) ---
    // This section correctly informs the user about the API's capabilities
    if (artistQuery && songQuery) {
        
    } else if (!songQuery && artistQuery) {
        chordsDisplay.innerHTML = `<p>Enter a song title to see message about full song chords. Use Chord/Scale Lookup for individual shapes.</p>`;
    } else if (!artistQuery && songQuery) {
        chordsDisplay.innerHTML = `<p>Enter an artist name to see message about full song chords. Use Chord/Scale Lookup for individual shapes.</p>`;
    } else {
        chordsDisplay.innerHTML = `<p>Enter both an artist name and song title to get information about full song chords (not available here directly). Use the Chord/Scale Lookup below for individual shapes.</p>`;
    }

});


// chordScaleButton.addEventListener('click', async () => {
//     const chordScaleQuery = chordScaleInput.value.trim();

    
//     chordScaleResults.innerHTML = '<p>Searching for chord or scale...</p>';

//     if (!chordScaleQuery) {
//         chordScaleResults.innerHTML = '<p>Please enter a chord or scale to lookup (e.g., C/major or C/pentatonic).</p>';
//         return;
//     }

//     try {
//         const chordScaleData = await getChordOrScale(chordScaleQuery);
        
//         if (chordScaleData && chordScaleData.image) { // Check if image property exists
//             chordScaleResults.innerHTML = `<h4>${chordScaleQuery}</h4><img src="${chordScaleData.image}" alt="${chordScaleQuery}" style="max-width:100%;">`;
//         } else if (chordScaleData && chordScaleData.text) { // Some results might just be text
//             chordScaleResults.innerHTML = `<h4>${chordScaleQuery}</h4><pre>${chordScaleData.text}</pre>`;
//         }
//         else {
//             chordScaleResults.innerHTML = `<p>No visual diagram or clear text found for "${chordScaleQuery}". Check console for raw data.</p>`;
//             console.log('Raw Scales-Chords.com data:', chordScaleData);
//         }
//     } catch (error) {
//         chordScaleResults.innerHTML = `<p class="error-message">Error fetching chord/scale: ${error.message}</p>`;
//         console.error('Error fetching chord/scale:', error);
//     }
// });