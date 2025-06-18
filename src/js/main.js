import { loadPartial } from './utils.mjs';
import { getArtistInfo } from './lastfm.js';
import { getLyrics } from './lyrics.js';

const MAX_RECENT_SEARCHES = 5;
const RECENT_SEARCHES_KEY = 'recentSearches';

console.log('main.js loaded!');


const artistInput = document.getElementById('artistInput');
const songInput = document.getElementById('songInput');
const searchButton = document.getElementById('searchButton');
const lyricsDisplay = document.getElementById('lyricsDisplay');
const artistInfoDisplay = document.getElementById('artistInfoDisplay');
const searchMessage = document.getElementById('searchMessage');
const recentSearchesDisplay = document.getElementById('recentSearchesDisplay');

console.log('VITE_LASTFM_API_KEY from .env:', import.meta.env.VITE_LASTFM_API_KEY);

function saveSearch(artist, song) {
    let searches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];


    const newSearch = { artist: artist, song: song };
    const searchString = `${artist}-${song}`;


    searches = searches.filter(s => `${s.artist}-${s.song}` !== searchString);


    searches.unshift(newSearch);


    if (searches.length > MAX_RECENT_SEARCHES) {
        searches = searches.slice(0, MAX_RECENT_SEARCHES);
    }

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    renderRecentSearches();
}

function renderRecentSearches() {
    let searches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
    if (recentSearchesDisplay) {
        if (searches.length === 0) {
            recentSearchesDisplay.innerHTML = '<p>No recent searches yet.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'recent-searches-list';
        searches.forEach(search => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" data-artist="${search.artist}" data-song="${search.song}">${search.artist}${search.song ? ' - ' + search.song : ''}</a>`;
            li.addEventListener('click', (e) => {
                e.preventDefault();
                artistInput.value = search.artist;
                songInput.value = search.song;
                searchButton.click();
            });
            ul.appendChild(li);
        });
        recentSearchesDisplay.innerHTML = '';
        recentSearchesDisplay.appendChild(ul);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPartial('#main-footer', '/partials/footer.html');
    renderRecentSearches();
});


searchButton.addEventListener('click', async () => {
    const artistQuery = artistInput.value.trim();
    const songQuery = songInput.value.trim();


    lyricsDisplay.innerHTML = '<p>Enter an artist name and song title to get lyrics.</p>';
    artistInfoDisplay.innerHTML = '<p>Enter an artist name to display artist information here.</p>';
    searchMessage.innerHTML = '';


    if (!artistQuery && !songQuery) {
        searchMessage.innerHTML = '<p class="error-message">Please enter an Artist Name and/or a Song Title to search.</p>';
        return;
    }

    searchMessage.innerHTML = '<p>Searching...</p>';
    console.log(`Searching for Artist: "${artistQuery}", Song: "${songQuery}"`);

    let lyricsFetched = false;
    let artistInfoFetched = false;


    if (artistQuery && songQuery) {
        try {

            lyricsDisplay.innerHTML = `<p>Searching lyrics for "${songQuery}" by "${artistQuery}"...</p>`;
            const lyricsText = await getLyrics(artistQuery, songQuery);
            if (lyricsText) {

                lyricsDisplay.innerHTML = `<h4>Lyrics for "${songQuery}" by ${artistQuery}:</h4><pre>${lyricsText}</pre>`; // Ensure formatting with <pre>
                lyricsFetched = true;
            } else {

                lyricsDisplay.innerHTML = `<p class="error-message">Lyrics for "${songQuery}" by ${artistQuery} not found.</p>`;
            }
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            lyricsDisplay.innerHTML = `<p class="error-message">Error fetching lyrics: ${error.message}. Please try again.</p>`;
        }
    } else if (!songQuery && artistQuery) {
        lyricsDisplay.innerHTML = `<p>Enter a song title in addition to "${artistQuery}" to get lyrics.</p>`;
    } else if (!artistQuery && songQuery) {
        lyricsDisplay.innerHTML = `<p>Enter an artist name in addition to "${songQuery}" to get lyrics.</p>`;
    } else {
        lyricsDisplay.innerHTML = `<p>Enter both an artist name and song title to get lyrics here.</p>`;
    }


    if (artistQuery) {
        try {
            artistInfoDisplay.innerHTML = `<p>Searching artist info for "${artistQuery}"...</p>`;
            const artistData = await getArtistInfo(artistQuery);
            if (artistData && artistData.name) {
                const bioText = artistData.bio || 'No biography available.';
                artistInfoDisplay.innerHTML = `<h3>Artist: ${artistData.name}</h3><p>${bioText}</p>`;
                artistInfoFetched = true;
            } else {
                artistInfoDisplay.innerHTML = `<p class="error-message">Artist information for "${artistQuery}" not found.</p>`;
            }
        } catch (error) {
            console.error('Error in main.js fetching artist info:', error);
            artistInfoDisplay.innerHTML = `<p class="error-message">Error fetching artist info: ${error.message}</p>`;
        }
    } else {
        artistInfoDisplay.innerHTML = `<p>Enter an artist name to display artist information here.</p>`;
    }


    if (lyricsFetched || artistInfoFetched) {
        searchMessage.innerHTML = `<p>Search results for "${artistQuery}${songQuery ? ' - ' + songQuery : ''}".</p>`;
    } else {
        searchMessage.innerHTML = `<p class="error-message">No results found for "${artistQuery}${songQuery ? ' - ' + songQuery : ''}". Please try different terms.</p>`;
    }
    saveSearch(artistQuery, songQuery);
});