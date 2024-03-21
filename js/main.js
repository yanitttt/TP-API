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
            const favContainer = document.createElement('div');
            favContainer.classList.add('favorite-item'); // Ajoutez une classe pour un meilleur ciblage CSS
    
            // Créez un élément pour le texte du favori
            const favText = document.createElement('span');
            favText.textContent = favorite;
    
            // Créez un bouton pour supprimer le favori
            const removeButton = document.createElement('span');
            removeButton.textContent = '❌';
            removeButton.classList.add('remove-favorite');
            removeButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Empêche la propagation du clic pour éviter de copier le texte dans la barre de recherche
                removeFavorite(favorite);
            });
    
            // Ajoutez un gestionnaire d'événements de clic pour copier le texte dans la barre de recherche
            favContainer.addEventListener('click', () => {
                searchBox.value = favorite; // Copiez le texte de l'élément favori dans la barre de recherche
                searchBox.focus(); // Focus sur la barre de recherche
                fetchCountryDetails(favorite); // Effectuez une recherche pour le favori
                updateFavoriteButton();
            });
    
            // Ajoutez les éléments à la container du favori
            favContainer.appendChild(favText);
            favContainer.appendChild(removeButton);
    
            // Ajoutez le container du favori à l'affichage
            favoritesDisplay.appendChild(favContainer);
        });
    }
    

    // Ajoutez une fonction pour supprimer une recherche favorite
    function removeFavorite(favorite) {
        const index = favorites.indexOf(favorite);
        if (index !== -1) {
            favorites.splice(index, 1); // Supprimez l'élément du tableau des favoris
            localStorage.setItem('favorites', JSON.stringify(favorites)); // Mettez à jour le stockage local
            updateFavoritesDisplay(); // Mettez à jour l'affichage des favoris
        }
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
    
            // Ajoutez un gestionnaire d'événements pour le survol
            countryElement.addEventListener('mouseenter', function() {
                this.style.backgroundImage = `url('${country.flags.svg}')`;
                this.style.backgroundSize = 'cover';
                this.style.backgroundPosition = 'center';
            });
    
            // Ajoutez un gestionnaire d'événements pour la sortie du survol
            countryElement.addEventListener('mouseleave', function() {
                this.style.backgroundImage = 'none';
            });
    
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
        if (query.length > 3) {
            if (!favorites.includes(query)) {
                favorites.push(query);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                updateFavoritesDisplay();
            }
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
