const animeList8 = document.getElementById('animeList');
const reviewsList8 = document.getElementById('reviews');
const reviews = [];
let currentAnime = null;
let editingIndex = -1; 
const likes = {};

function searchAnime() {
    const title = document.getElementById('title').value.toLowerCase();
    const genre = document.getElementById('genre').value.toLowerCase();

    let query = `q=${encodeURIComponent(title)}`;
    if (genre) {
        query += `&genre=${encodeURIComponent(genre)}`;
    }

    fetch(`https://api.jikan.moe/v4/anime?${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const animeList = data.data;
            animeList8.innerHTML = ''; 
            if (animeList && animeList.length > 0) {
                displayAnime(animeList);
            } else {
                animeList8.innerHTML = '<p>No results found.</p>';
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
            animeList8.innerHTML = '<p>Error fetching anime. Please try again.</p>';
        });
}

function displayAnime(animeList) {
    animeList8.innerHTML = ''; 
    animeList.forEach(anime => {
        const animeItem = document.createElement('div');
        animeItem.classList.add('anime-item');

        if (!likes[anime.title]) {
            likes[anime.title] = 0;
        }

        animeItem.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <h4>${anime.title}</h4>
            <p>Score: ${anime.score}</p>
            <button type="button" onclick="setCurrentAnime('${anime.title}', '${anime.images.jpg.image_url}', '${anime.score}')">Review</button>
            <button type="button" onclick="likeAnime('${anime.title}')">Like ❤️</button>
            <span>Likes: <span id="likes-${anime.title}">${likes[anime.title]}</span></span>
        `;

        animeList8.appendChild(animeItem);
    });
}

function likeAnime(title) {
    likes[title] += 1; 
    document.getElementById(`likes-${title}`).textContent = likes[title];
    alert(`You liked ${title}!`);
}

function setCurrentAnime(title, imageUrl, score) {
    currentAnime = { title, imageUrl, score };
    displayReviews();
}

function submitReview() {
    const reviewText = document.getElementById('reviewInput').value;
    if (reviewText && currentAnime) {
        if (editingIndex >= 0) {
            reviews[editingIndex].text = reviewText;
            editingIndex = -1;
        } else {
            reviews.push({ text: reviewText, anime: currentAnime });
        }
        document.getElementById('reviewInput').value = '';
        displayReviews();
    } else {
        alert('Please enter a review and select an anime to review.');
    }
}

function displayReviews() {
    reviewsList8.innerHTML = reviews.map((review, index) => `
        <li>
            <h4>${review.anime.title} (Score: ${review.anime.score})</h4>
            <img src="${review.anime.imageUrl}" alt="${review.anime.title}" class="review-image">
            <p>${review.text}</p>
            <button onclick="editReview(${index})">Edit</button>
            <button onclick="deleteReview(${index})">Delete</button>
        </li>
    `).join('');
}

function editReview(index) {
    editingIndex = index;
    const reviewToEdit = reviews[index];
    document.getElementById('reviewInput').value = reviewToEdit.text;
}

function deleteReview(index) {
    reviews.splice(index, 1);
    displayReviews();
}


window.onload = function() {
};
