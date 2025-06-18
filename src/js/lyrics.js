import { fetchData } from './utils.mjs';

const GENIUS_API_BASE_URL = '/api/genius/';
const GENIUS_ACCESS_TOKEN = import.meta.env.VITE_GENIUS_ACCESS_TOKEN;

const GENIUS_WEBSITE_BASE_URL = 'https://genius.com';

/**
 * Searches for a song on Genius API.
 * @param {string} artistName
 * @param {string} songTitle
 * @returns {Promise<Object>} The first hit object (containing song ID and path) or null.
 */
async function searchGeniusSong(artistName, songTitle) {
    if (!GENIUS_ACCESS_TOKEN) {
        console.error('Genius Access Token is not configured. Please set VITE_GENIUS_ACCESS_TOKEN in your .env file.');
        throw new Error('Genius API token missing.');
    }

    const query = `${songTitle} ${artistName}`;
    const url = `${GENIUS_API_BASE_URL}search?q=${encodeURIComponent(query)}`;

    try {
        const headers = {
            'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        };
        const data = await fetchData(url, { headers });

        if (data && data.response && data.response.hits && data.response.hits.length > 0) {

            return data.response.hits[0].result;
        }
        return null;
    } catch (error) {
        console.error('Error searching Genius song:', error);
        throw error;
    }
}

/**
 * Scrapes lyrics from the Genius.com song page.
 * NOTE: This is a fragile method as it depends on Genius.com's HTML structure.
 * A dedicated server-side scraper is more robust.
 * @param {string} songPath - The path to the song on Genius (e.g., /songs/12345).
 * @returns {Promise<string|null>} The lyrics text or null if not found.
 */
async function scrapeGeniusLyrics(songPath) {

    const PUBLIC_CORS_PROXY = 'https://corsproxy.io/?';
    const directUrl = `${GENIUS_WEBSITE_BASE_URL}${songPath}`;
    const proxyScrapeUrl = `${PUBLIC_CORS_PROXY}${encodeURIComponent(directUrl)}`;


    try {
        const response = await fetch(proxyScrapeUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch song page for scraping: ${response.status}`);
        }
        const htmlText = await response.text();


        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');


        const lyricsDiv = doc.querySelector('[data-lyrics-container="true"]');

        if (lyricsDiv) {
            // Replace <br> with newlines for formatting
            let lyricsHtml = lyricsDiv.innerHTML.replace(/<br>/g, '\n');
            // Remove any remaining HTML tags (like <a> for annotations)
            lyricsHtml = lyricsHtml.replace(/<[^>]*>/g, '');
            // Decode HTML entities (like &amp;)
            lyricsHtml = lyricsHtml.replace(/&amp;/g, '&');
            lyricsHtml = lyricsHtml.replace(/&lt;/g, '<');
            lyricsHtml = lyricsHtml.replace(/&gt;/g, '>');
            // Trim whitespace
            return lyricsHtml.trim();
        }
        return null;
    } catch (error) {
        console.error('Error scraping lyrics:', error);
        return null;
    }
}

/**
 * Fetches lyrics for a given artist and song title from Genius API.
 * @param {string} artistName - The name of the artist.
 * @param {string} songTitle - The title of the song.
 * @returns {Promise<string>} - A promise that resolves with the lyrics text.
 * @throws {Error} If lyrics are not found or an API error occurs.
 */
export async function getLyrics(artistName, songTitle) {
    try {
        const songData = await searchGeniusSong(artistName, songTitle);

        if (songData && songData.path) {
            console.log('Found song on Genius:', songData);
            const lyrics = await scrapeGeniusLyrics(songData.path);
            if (lyrics) {
                return lyrics;
            } else {
                throw new Error(`Could not scrape lyrics for "${songTitle}" by "${artistName}".`);
            }
        } else {
            throw new Error(`Song "${songTitle}" by "${artistName}" not found on Genius.`);
        }
    } catch (error) {
        console.error(`Error in getLyrics (Genius):`, error);
        throw error;
    }
}