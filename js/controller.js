class CountryController {
  model;
  view;
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.#bindCountryEvents();
  }

  #bindCountryEvents() {
    // Écouteur d'événement pour la saisie dans la barre de recherche
    this.view.searchBox.addEventListener("input", () => {
      this.searchCountry(searchBox.value.trim());
    });
    
    // Écouteur d'événement pour les favoris
    this.view.favoriteButton.addEventListener("click", () => {
        const query = this.view.searchBox.value.trim();
        if (query) { // Assurez-vous que le champ n'est pas vide
          this.toggleFavorite(query);
          this.view.updateFavoritesDisplay();
        }
      });


    // Écouteur d'événement pour le clic sur l'icône de réinitialisation
this.view.resetIcon.addEventListener('click', () => {
    console.log("sdqdsq");
    this.view.resetSearch();
});


    // Écouteur d'événement pour le changement de filtre
    this.view.filterSelect.addEventListener("change", () => {
      this.searchCountry(searchBox.value.trim());
    });

    // Écouteur d'événement pour le clic sur le bouton de la barre latérale
    this.view.sidebarButton.addEventListener("click", () => {
      this.view.favoritesContainer.classList.toggle("open");
      this.view.updateFavoritesDisplay();
    });

    // Gestion des événements pour le survol et le clic sur le pays
    const countryElements = document.querySelectorAll(".result-item");
    countryElements.forEach((countryElement) => {
      countryElement.addEventListener("mouseenter", () => {
        // Gérer l'affichage du drapeau au survol
      });

      countryElement.addEventListener("click", () => {
        // Gérer l'affichage des détails du pays lors du clic
      });
    });
  }

  async searchCountry(query) {
    try {
      const countries = await this.model.fetchCountryDetails(
        query,
        this.view.filter.value
      );
      this.view.displayResults(countries);
    } catch (error) {
      // Gestion des erreurs
    }
  }

  initializeFavorites() {
    // Récupérer les favoris du sessionStorage
    const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];
    favorites.forEach(fav => {
      // Mettre à jour l'affichage ou le state si nécessaire
    });
  }

  toggleFavorite(query) {
    if (!query) {
      return; // Ne rien faire si la requête est vide
    }

    let favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];
    const queryLower = query.toLowerCase();

    if (favorites.includes(queryLower)) {
      // Le pays est déjà dans les favoris, éventuellement gérer la suppression ici
      this.view.favoriteButton.classList.remove('active');
      this.view.favoriteButton.textContent = '☆';
      // Supprimer des favoris si nécessaire
      favorites = favorites.filter(fav => fav !== queryLower);
    } else {
      // Ajouter aux favoris
      favorites.push(queryLower);
      this.view.favoriteButton.classList.add('active');
      this.view.favoriteButton.textContent = '★';
      this.view.favoriteButton.style.color = 'black'; // Change la couleur du bouton en noir
    }

    sessionStorage.setItem('favorites', JSON.stringify(favorites));
  }





}
