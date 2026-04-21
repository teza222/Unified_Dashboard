const API_KEY = 'AIzaSyCfj0GSxgmDimOqFISRSCCjhO6jgoFAbvM';
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const videoPlayer = document.getElementById('videoPlayer');
const statusLabel = document.getElementById('status');

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
        const response = await fetch(`${SEARCH_URL}?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
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
        console.error(error);
        statusLabel.textContent = 'Unable to load videos. Please try again later.';
    }
});

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

function setVideo(videoId) {
    videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
    statusLabel.textContent = 'Playing selected video.';
}
