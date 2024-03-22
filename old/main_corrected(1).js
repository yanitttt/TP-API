
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    const favoriteButton = document.getElementById('favoriteButton');
    const resetIcon = document.getElementById('resetIcon');
    const resultsContainer = document.getElementById('results');
    const favoritesDisplay = document.getElementById('favoritesDisplay');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function updateFavoritesDisplay() {
        favoritesDisplay.innerHTML = favorites.length ? '' : '(Aucune recherche favorite)';
        favorites.forEach(favorite => {
            const favElement = document.createElement('div');
            favElement.textContent = favorite;
            favoritesDisplay.appendChild(favElement);
        });
    }

    function updateFavoriteButton() {
        if (!searchBox.value.trim()) {
            favoriteButton.classList.remove('active');
            favoriteButton.disabled = true;
            favoriteButton.textContent = '☆';
        } else if (favorites.includes(searchBox.value.trim().toLowerCase())) {
            favoriteButton.classList.add('active');
            favoriteButton.disabled = false;
            favoriteButton.textContent = '★';
        } else {
            favoriteButton.classList.remove('active');
            favoriteButton.disabled = false;
            favoriteButton.textContent = '☆';
        }
    }

    function fetchCountryDetails(query) {
        fetch(`https://restcountries.com/v3.1/name/${query}`)
            .then(response => response.json())
            .then(data => {
                if (!data.status) {
                    displayResults(data);
                } else {
                    resultsContainer.innerHTML = 'Aucun résultat trouvé.';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultsContainer.innerHTML = 'Erreur lors de la recherche.';
            });
    }

    function displayResults(countries) {
        resultsContainer.innerHTML = '';
        countries.forEach(country => {
            const countryElement = document.createElement('div');
            countryElement.classList.add('result-item');
            countryElement.textContent = country.name.common;
            countryElement.addEventListener('click', () => displayCountryDetails(country));
            resultsContainer.appendChild(countryElement);
        });
    }

    function displayCountryDetails(country) {
        resultsContainer.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'country-card';
        card.innerHTML = `
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="country-flag">
            <h2 class="country-name">${country.name.common}</h2>
            <div class="country-details">
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'Non disponible'}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
            </div>
        `;
        resultsContainer.appendChild(card);
    }

    searchBox.addEventListener('input', () => {
        updateFavoriteButton();
        const query = searchBox.value.trim();
        if (query.length > 2) {
            fetchCountryDetails(query);
        } else {
            resultsContainer.innerHTML = '';
        }
    });

    favoriteButton.addEventListener('click', () => {
        const query = searchBox.value.trim().toLowerCase();
        if (!favorites.includes(query)) {
            favorites.push(query);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateFavoritesDisplay();
        }
    });

    resetIcon.addEventListener('click', () => {
        searchBox.value = '';
        resultsContainer.innerHTML = '';
        updateFavoriteButton();
    });

    updateFavoritesDisplay();
    updateFavoriteButton();
});
