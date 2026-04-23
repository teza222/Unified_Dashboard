const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const videoPlayer = document.getElementById('videoPlayer');
const statusLabel = document.getElementById('status');

/**
 * @param {Event} event - The search form submission event.
 * @returns {Promise<void>}
 * @description Prevents default form submission, validates input, and initiates 
 * the asynchronous fetch request to the YouTube Data API.
 */
searchForm.addEventListener('submit', async event => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) {
        statusLabel.textContent = 'Please enter a search term.';
        return;
    }

    statusLabel.textContent = 'Searching for videos...';
    resultsContainer.innerHTML = '';

    try {
        const response = await fetch(`${SEARCH_URL}?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`);
        if (!response.ok) {
            const errorData = await response.json();
            // Log detailed API error to the console for technical review
            console.error("YouTube API Error Details:", errorData);
            const errorMessage = errorData.error?.message || `API Error: ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            statusLabel.textContent = 'No videos found for that topic.';
            return;
        }

        statusLabel.textContent = `Showing top ${data.items.length} videos for "${query}".`;
        renderResults(data.items);
        const firstVideoId = data.items[0].id.videoId;
        if (firstVideoId) {
            setVideo(firstVideoId);
        }
    } catch (error) {
        console.error("Video search failed:", error.message);
        statusLabel.textContent = `Search failed: ${error.message}. Please check your API key in config.js.`;
    }
});

/**
 * @param {Array} items - The list of video items from YouTube API .
 * @returns {void}
 * @description Generates HTML card elements for each video and injects them into the results container.
 */
function renderResults(items) {
    const cards = items.map(item => {
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const channel = item.snippet.channelTitle;
        const thumbnail = item.snippet.thumbnails.medium.url;

        return `
            <div class="col">
                <div class="card h-100 bg-dark bg-opacity-75 text-white result-card shadow-sm border-0" data-video-id="${videoId}">
                    <img src="${thumbnail}" class="card-img-top" alt="${title}" />
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text text-muted mb-0">${channel}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    resultsContainer.innerHTML = cards;
    attachCardListeners();
}

/**
 * @description Finds all rendered result cards and attaches click event listeners to play the respective video.
 */
function attachCardListeners() {
    const cards = resultsContainer.querySelectorAll('.result-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const selectedVideoId = card.dataset.videoId;
            if (selectedVideoId) {
                setVideo(selectedVideoId);
            }
        });
    });
}

/**
 * @param {string} videoId - The YouTube unique video ID.
 * @description Updates the iframe source to embed the selected video and updates the status label.
 */
function setVideo(videoId) {
    videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
    statusLabel.textContent = 'Playing selected video.';
}
