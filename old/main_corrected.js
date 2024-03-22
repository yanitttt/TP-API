
document.addEventListener('DOMContentLoaded', function() {
    var resetIcon = document.querySelector('.reset-icon');
    const searchBox = document.getElementById('searchBox');
    const favoriteButton = document.getElementById('favoriteButton');
    const favoritesList = document.getElementById('favoritesList');
    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    function updateFavoriteButton() {
        if (searchBox.value === '') {
            favoriteButton.style.backgroundColor = 'grey';
            favoriteButton.disabled = true;
            favoriteButton.textContent = '☆';
        } else if (favorites.includes(searchBox.value.toLowerCase())) {
            favoriteButton.classList.add('active');
            favoriteButton.textContent = '★';
        } else {
            favoriteButton.classList.remove('active');
            favoriteButton.textContent = '☆';
            favoriteButton.style.backgroundColor = '';
            favoriteButton.disabled = false;
        }
    }
    
    function displayFavorites() {
        favoritesList.innerHTML = '';
        if (favorites.length === 0) {
            favoritesList.textContent = '(Aucune recherche favorite)';
        } else {
            favorites.forEach(favorite => {
                const item = document.createElement('div');
                item.classList.add('favorite-item');
                item.textContent = favorite;
                
                const removeBtn = document.createElement('span');
                removeBtn.textContent = '⨷';
                removeBtn.classList.add('remove-favorite');
                removeBtn.onclick = function() {
                    if (confirm('Souhaitez-vous vraiment supprimer ce favori ?')) {
                        favorites = favorites.filter(fav => fav !== favorite);
                        localStorage.setItem('favorites', JSON.stringify(favorites));
                        displayFavorites();
                        updateFavoriteButton();
                    }
                };
                
                item.appendChild(removeBtn);
                favoritesList.appendChild(item);
            });
        }
    }
    
    favoriteButton.addEventListener('click', function() {
        const query = searchBox.value.toLowerCase();
        if (favorites.includes(query)) {
            favorites = favorites.filter(fav => fav !== query);
        } else {
            favorites.push(query);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
        updateFavoriteButton();
    });
    
    searchBox.addEventListener('input', function() {
        resetIcon.style.visibility = this.value ? 'visible' : 'hidden';
        updateFavoriteButton();
    });

    resetIcon.addEventListener('click', function() {
        searchBox.value = '';
        this.style.visibility = 'hidden';
        document.getElementById('results').innerHTML = '';
        updateFavoriteButton();
    });

    document.getElementById('searchBox').addEventListener('input', function() {
        let query = this.value;
        if (query.length > 2) {
            fetch(`https://restcountries.com/v3.1/name/${query}`)
                .then(response => response.json())
                .then(data => {
                    if (!data.status) {
                        displayResults(data);
                    } else {
                        document.getElementById('results').innerHTML = 'Aucun résultat trouvé.';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('results').innerHTML = 'Erreur lors de la recherche.';
                });
        } else {
            document.getElementById('results').innerHTML = '';
        }
    });

    function displayResults(countries) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';
        countries.forEach(country => {
            let countryElement = document.createElement('div');
            countryElement.classList.add('result-item');
            countryElement.setAttribute('data-flag-url', country.flags.svg);
            countryElement.innerHTML = `<h3>${country.name.common}</h3>`;
            countryElement.addEventListener('mouseover', function() {
                this.style.backgroundImage = `url('${this.getAttribute('data-flag-url')}')`;
                this.style.color = 'transparent';
            });
            countryElement.addEventListener('mouseout', function() {
                this.style.backgroundImage = '';
                this.style.color = '';
            });
            resultsContainer.appendChild(countryElement);
        });
    }

    displayFavorites();
});
