import { loadPartial } from './utils.mjs';

document.addEventListener('DOMContentLoaded', () => {

    loadPartial('#main-footer', '/partials/footer.html');

    const chordInput = document.getElementById('chordInput');
    const lookupButton = document.getElementById('lookupButton');
    const chordResults = document.getElementById('chordResults');

    lookupButton.addEventListener('click', () => {
        const query = chordInput.value.trim();
        if (!query) {
            chordResults.innerHTML = '<p class="error-message">Please enter a chord or scale name.</p>';
            return;
        }

        chordResults.innerHTML = '<p>Opening diagram for ' + query + ' in a new tab...</p>';

        const encodedQuery = encodeURIComponent(query);

        let targetUrl = '';
        if (query.toLowerCase().includes('scale')) {
            const scaleQueryFormatted = query.toLowerCase().replace(/ /g, '_');
            targetUrl = `https://www.scales-chords.com/scale/${encodeURIComponent(scaleQueryFormatted)}.php`;
        } else {
            targetUrl = `https://www.scales-chords.com/chord/${encodedQuery}.php`;
        }

        window.open(targetUrl, '_blank');

        setTimeout(() => {
            chordResults.innerHTML = '<p>Diagram opened in a new tab. Enter another chord or scale.</p>';
        }, 2000);
    });
});