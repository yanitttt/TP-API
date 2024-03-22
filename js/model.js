class CountryModel {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    }

    async fetchCountryDetails(query, filter) {
        let url;
        if (filter === 'all') {
            url = `https://restcountries.com/v3.1/name/${query}`;
        } else {
            url = `https://restcountries.com/v3.1/region/${filter}`;
        }
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!data.status) {
                return data.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase()));
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}
