// src/js/utils.mjs
// Utility function for fetching data (e.g., using axios)
export async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options); // Using native fetch for simplicity, or replace with axios
        if (!response.ok) {
            // You can customize error handling here
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw to be caught by calling function
    }
}

// Other utility functions can go here (e.g., DOM manipulation helpers)