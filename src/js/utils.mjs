
export async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text(); // Get raw text
            let errorMessage = `HTTP error! Status: ${response.status} ${response.statusText}`;
            try {
                const errorJson = JSON.parse(errorText); // Try parsing as JSON
                if (errorJson.message) {
                    errorMessage += `, Message: ${errorJson.message}`;
                }
            } catch (e) {
                // If it's not JSON, or no message, use the default HTTP error message
            }
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error('Error in fetchData:', error);
        // **ADD THIS BLOCK** for more specific network error message
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('Network error or server unreachable. Please check your connection or try again later, or the API might be down.');
        }
        throw error; // Re-throw to propagate the error
    }
}

export async function loadPartial(selector, partialPath) {
    try {
        const response = await fetch(partialPath);
        if (!response.ok) {
            throw new Error(`Failed to load partial: ${partialPath}, status: ${response.status}`);
        }
        const html = await response.text();
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;
        } else {
            console.warn(`Element with selector "${selector}" not found for partial loading.`);
        }
    } catch (error) {
        console.error('Error loading partial:', error);
    }
}
