const apiKey = "U8IFO1Ay2pxX3WAk2HsAElEtFeLObSbrp0CeVd9ncfWGE0vt";
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const spinner = document.getElementById("spinner");


        // Seach when click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchArticles(query);
  }
});
        // Search using enter button
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
      fetchArticles(query);
    }
  }
});

        //Auto Load Trending News - DO NOTE USERS CAN STILL SEARCH JUST EXTRA STUFF
window.addEventListener("DOMContentLoaded", () => {
  fetchArticles("trending"); 
});

async function fetchArticles(query) {
  resultsDiv.innerHTML = "";
  spinner.classList.remove("d-none"); // Spinner

  try {
    const response = await fetch(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${apiKey}`
    );
    const data = await response.json();
    displayArticles(data.response.docs);
  } catch (error) {
    resultsDiv.innerHTML = `<p class="text-danger">Error fetching articles.</p>`;
  } finally {
    spinner.classList.add("d-none"); // Hide spinner
  }
}

function displayArticles(articles) {
  if (articles.length === 0) {
    resultsDiv.innerHTML = `<p class="text-muted">No results found.</p>`;
    return;
  }

  articles.forEach(article => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4"; 

    const summary = article.lead_paragraph || article.snippet || "No summary available.";

       let imageUrl = "https://via.placeholder.com/210x140?text=No+Image";
    if (Array.isArray(article.multimedia) && article.multimedia.length) {
      imageUrl = "https://www.nytimes.com/" + article.multimedia[0].url;
    } else if (article.multimedia?.default?.url) {
      imageUrl = article.multimedia.default.url;
    }

    col.innerHTML = `
      <div class="card h-100">
        <img src="${imageUrl}" class="card-img-top" alt="Article image">
        <div class="card-body">
          <h5 class="card-title">${article.headline.main}</h5>
          <p class="card-text">${summary}</p>
          <a href="${article.web_url}" target="_blank" class="btn btn-primary">Read More</a>
        </div>
      </div>
    `;
    resultsDiv.appendChild(col);
  });
}
