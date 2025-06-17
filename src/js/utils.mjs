
export async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {

            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
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
