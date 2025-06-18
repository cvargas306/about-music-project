import { fetchData } from './utils.mjs';

const LYRICS_BASE_URL = '/api.lyrics/';

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


    const encodedArtist = encodeURIComponent(artistName);
    const encodedTitle = encodeURIComponent(songTitle);

    const url = `${LYRICS_BASE_URL}${encodedArtist}/${encodedTitle}`;
    console.log('Fetching lyrics from (proxy URL):', url);

    try {
        const data = await fetchData(url);
        console.log('Lyrics.ovh Response:', data);

        if (data.error) {
            throw new Error(data.error);
        }

        if (!data.lyrics) {
            throw new Error(`Lyrics not found for "${songTitle}" by "${artistName}".`);
        }

        return data.lyrics;

    } catch (error) {
        console.error(`Error fetching lyrics for "${songTitle}" by "${artistName}":`, error);

        if (error.message.includes('No lyrics found') || error.message.includes('No lyrics found.')) {
            throw new Error(`Lyrics not found for "${songTitle}" by "${artistName}".`);
        }
        throw error;
    }
}