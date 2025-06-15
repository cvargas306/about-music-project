// src/js/lyrics.js
import { fetchData } from './utils.mjs';

const LYRICS_BASE_URL = 'https://api.lyrics.ovh/v1/';

/**
 * Fetches lyrics for a given artist and song title from Lyrics.ovh.
 * @param {string} artistName - The name of the artist.
 * @param {string} songTitle - The title of the song.
 * @returns {Promise<string>} - A promise that resolves with the lyrics text.
 * @throws {Error} If lyrics are not found or an API error occurs.
 */
export async function getLyrics(artistName, songTitle) {
    if (!artistName || !songTitle) {
        throw new Error('Artist name and song title are required to fetch lyrics.');
    }

    // Sanitize inputs for URL (replace spaces with hyphens, etc. if needed by API, though Lyrics.ovh is quite forgiving)
    // For Lyrics.ovh, it's often better to just encode the components directly.
    const encodedArtist = encodeURIComponent(artistName);
    const encodedTitle = encodeURIComponent(songTitle);

    const url = `${LYRICS_BASE_URL}${encodedArtist}/${encodedTitle}`;

    try {
        const data = await fetchData(url); // fetchData expects a full URL string
        console.log('Lyrics.ovh Response:', data);

        if (data.error) {
            throw new Error(data.error);
        }

        if (!data.lyrics) {
            throw new Error(`Lyrics not found for "${songTitle}" by "${artistName}".`);
        }

        // Lyrics.ovh typically returns a 'lyrics' property directly
        return data.lyrics;

    } catch (error) {
        console.error(`Error fetching lyrics for "${songTitle}" by "${artistName}":`, error);
        // Translate common errors to more user-friendly messages
        if (error.message.includes('No lyrics found') || error.message.includes('No lyrics found.')) {
            throw new Error(`Lyrics not found for "${songTitle}" by "${artistName}".`);
        }
        throw error; // Re-throw to be handled by the caller (main.js)
    }
}