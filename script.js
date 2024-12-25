const apikey = '2d1bea3fa7854d64bf66fef7d69f78fb';

const blogcontainer = document.getElementById("blog-container");
const searchField = document.getElementById('search-input');
const searchBtn = document.getElementById('search-button');
const darkModeBtn = document.getElementById('dark-mode-toggle');
const loadMoreBtn = document.getElementById('load-more');

let currentPage = 1;

searchBtn.addEventListener("click", async () => {
  const query = searchField.value.trim();
  if (query !== "") {
    try {
      const articles = await fetchNewsQuery(query);
      displayBlogs(articles);
    } catch (error) {
      console.log("Error fetching news by query", error);
    }
  }
});

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle('dark-mode');
});

loadMoreBtn.addEventListener("click", async () => {
  currentPage++;
  try {
    const articles = await fetchRandomNews(currentPage);
    displayBlogs(articles);
  } catch (error) {
    console.error("Error fetching more news", error);
  }
});

async function fetchNewsQuery(query) {
  try {
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const apiURL = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&page=${randomPage}&apikey=${apikey}`;
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error("Error fetching news query", error);
    return [];
  }
}

async function fetchRandomNews(page = 1) {
  try {
    const apiURL = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&page=${page}&apikey=${apikey}`;
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error("Error fetching random news", error);
    return [];
  }
}

function displayBlogs(articles) {
  blogcontainer.innerHTML = ""; 

  if (!articles.length) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "No articles available at the moment.";
    errorMessage.style.textAlign = "center";
    blogcontainer.appendChild(errorMessage);
    return;
  }

  articles.forEach((article) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");

    const img = document.createElement("img");
    img.src = article.urlToImage || "https://via.placeholder.com/600x400?text=Image+Not+Available";
    img.alt = article.title || "No title available";

    const title = document.createElement("h2");
    const truncatedTitle = article.title
      ? article.title.length > 30
        ? article.title.slice(0, 30) + "..."
        : article.title
      : "No title available";
    title.textContent = truncatedTitle;

    const description = document.createElement("p");
    const truncatedDescription = article.description
      ? article.description.length > 120
        ? article.description.slice(0, 120) + "..."
        : article.description
      : "No description available.";
    description.textContent = truncatedDescription;

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    blogcontainer.appendChild(blogCard);
  });
}

(async () => {
  try {
    const articles = await fetchRandomNews();
    displayBlogs(articles);
  } catch (error) {
    console.error("Error fetching random news on page load", error);
  }
})();

function filterByCategory(category) {
  fetchRandomNews().then((articles) => {
    const filteredArticles = articles.filter(article => article.category === category);
    displayBlogs(filteredArticles);
  });
}
