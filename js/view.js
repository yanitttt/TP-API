class CountryView {
  resultsContainer;
  favoritesDisplay;
  filter;
  nfavoritesContainer;
  sidebarButton;
  searchBox;
  filterSelect;
  favoriteButton;
  resetIcon;

  constructor() {
    this.resultsContainer = document.getElementById("results");
    this.favoritesDisplay = document.getElementById("favoritesDisplay");

    this.filter = document.getElementById("filter");
    this.favoritesContainer = document.getElementById("favoritesContainer");
    this.sidebarButton = document.getElementById("sidebarButton");
    this.searchBox = document.getElementById("searchBox");
    this.filterSelect = document.getElementById("filter");
    this.favoriteButton = document.getElementById("favoriteButton");
    this.resetIcon = document.getElementById("resetIcon");
  }

  displayResults(countries) {
    this.resultsContainer.innerHTML = "";
    countries.forEach((country) => {
      const countryElement = document.createElement("div");
      countryElement.classList.add("result-item");
      countryElement.textContent = country.name.common;

           // Gestion des événements pour le survol et le clic sur le pays
           countryElement.addEventListener('mouseenter', function() {
            this.style.backgroundImage = `url('${country.flags.svg}')`;
            this.style.backgroundSize = 'cover';
            this.style.backgroundPosition = 'center';
        });


        // Ajoutez un gestionnaire d'événements pour la sortie du survol
        countryElement.addEventListener('mouseleave', function() {
            this.style.backgroundImage = 'none';
        });

        countryElement.addEventListener('click', () => {
            this.resultsContainer.innerHTML = '';
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
            this.resultsContainer.appendChild(card);            });



      this.resultsContainer.appendChild(countryElement);
    });
  }

  updateFavoritesDisplay() {
    // Récupérer les favoris depuis le sessionStorage
    const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];

    // Vider le conteneur des favoris
    this.favoritesDisplay.innerHTML = '';

    if (favorites.length === 0) {
        this.favoritesDisplay.textContent = '(Aucune recherche favorite)';
    } else {
        favorites.forEach(favorite => {
            const favElement = document.createElement('div');
            favElement.classList.add('favorite-item');
            favElement.textContent = favorite;

            // Gestionnaire d'événement pour écrire le contenu du favori dans la barre de recherche
            favElement.addEventListener('click', () => {
                this.searchBox.value = favorite; // Écrit le favori dans la barre de recherche
                this.searchBox.dispatchEvent(new Event('input')); // Déclenche l'événement input si nécessaire
            });

            const removeButton = document.createElement('button');
            removeButton.textContent = '❌';
            removeButton.classList.add('remove-favorite');
            removeButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Empêche le clic sur le bouton de supprimer de propager au div du favori
                this.removeFavorite(favorite);
            });

            favElement.appendChild(removeButton);
            this.favoritesDisplay.appendChild(favElement);
        });
    }
}


  removeFavorite(favorite) {
    // Implémenter la logique pour supprimer un favori du sessionStorage et mettre à jour l'affichage
    let favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];
    const index = favorites.indexOf(favorite);
    if (index !== -1) {
      favorites.splice(index, 1);
      sessionStorage.setItem('favorites', JSON.stringify(favorites));
      this.updateFavoritesDisplay();
      // Mettre à jour l'état du bouton des favoris si nécessaire
      this.updateFavoriteButtonState();
    }
  }

  updateFavoriteButtonState() {
    // Cette méthode devrait mettre à jour l'état du bouton des favoris
    // similaire à ce que vous avez déjà implémenté dans le contrôleur
    let favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];
    if (favorites.includes(this.searchBox.value.trim().toLowerCase())) {
      this.favoriteButton.classList.add('active');
      this.favoriteButton.textContent = '★';
      this.favoriteButton.style.color = 'black'; // Favori présent
    } else {
      this.favoriteButton.classList.remove('active');
      this.favoriteButton.textContent = '☆';
      this.favoriteButton.style.color = ''; // Favori absent
    }
  }

  resetSearch() {
    // Réinitialiser le champ de recherche
    this.searchBox.value = '';

    // Réinitialiser les résultats de recherche
    this.resultsContainer.innerHTML = '';

    // Réinitialiser l'état du bouton des favoris
    this.updateFavoriteButtonState();

    // Optionnellement, vous pouvez aussi réinitialiser l'affichage des favoris ou d'autres éléments d'UI ici
}

}
