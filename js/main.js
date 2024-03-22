let viewDebug;
window.addEventListener('load', function() {
    const model = new CountryModel();
    const view = new CountryView();
    const controller = new CountryController(model, view);
    viewDebug = view;

    console.log(view);
});

