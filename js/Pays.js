class Pays {
    nom;
    capitale;
    continent;
    superficie;
    population;
    drapeau;
    vueCarte;

    constructor(nom, capitale, continent, superficie, population, drapeau, vueCarte) {
        this.nom = nom;
        this.capitale = capitale;
        this.continent = continent;
        this.superficie = superficie;
        this.population = population;
        this.drapeau = drapeau;
        this.vueCarte = vueCarte;
    }

    // Getters
    get nom() {
        return this.nom;
    }

    get capitale() {
        return this.capitale;
    }

    get continent() {
        return this.continent;
    }

    get superficie() {
        return this.superficie;
    }

    get population() {
        return this.population;
    }

    get drapeau() {
        return this.drapeau;
    }

    get vueCarte() {
        return this.vueCarte;
    }

    // Méthode statique pour récupérer les détails d'un pays.
    static async fetchCountryDetails(query, filter = 'all') {
        let url;
        if (filter === 'all') {
            url = `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`;
        } else {
            url = `https://restcountries.com/v3.1/region/${encodeURIComponent(filter)}`;
        }
        try {
            const response = await fetch(url);
            const data = await response.json();
            // Vérifie si l'API retourne une erreur (pas de status dans un succès)
            if (!data.status) {
                return data.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase()))
                           .map(country => new Pays(
                                country.name.common,
                                country.capital ? country.capital[0] : 'Non spécifiée',
                                country.region,
                                country.area,
                                country.population,
                                country.flags.svg,
                                country.maps.googleMaps
                            ));
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}
