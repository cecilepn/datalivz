// Initialisation de la map et des marqueurs
function initialize() {
    // Objet pour stocker les informations sur les pays (latitude, longitude)
    const pays = {};

    // Récupération du fichier cine.json pour obtenir les informations sur les pays
    fetch("./json/cine.json")
        .then(response => response.json())
        .then(function (data) {
            data.forEach(function (p) {
                pays[p.pays] = {
                    lat: p.lat,
                    long: p.long
                }
            });
        });

    // Création d'une nouvelle carte avec Windy API 
    var earth = new WE.map('earth_div', { atmosphere: true, sky: false, dragging: true });

    // Personnalisation de la carte en utilisant un thème sombre
    WE.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {}).addTo(earth);

    // Changement du curseur de la souris pendant le survol de la carte
    earth.on('pointerdown', function () {
        document.body.style.cursor = 'pointer';
    });

    earth.on('pointerup', function () {
        document.body.style.cursor = 'auto';
    });


    // Tableau stockant les marqueurs sur la carte
    let markers = [];

    // Fonction générant des marqueurs sur la carte en fonction des données de cine.json
    function markerGenerate() {
        // Suppression des marqueurs existants
        markers.forEach(m => earth.removeMarker(m));
        markers = [];

        // Objet pour suivre les théâtres dans chaque pays
        let countryTheaters = {};

        // Récupération des données de cine.json
        fetch("./json/cine.json")
            .then(response => response.json())
            .then(function (data) {
                data.forEach(function (e) {
                    const countryKey = e.pays;

                    // Vérification si un marqueur pour ce pays n'a pas encore été ajouté
                    if (!countryTheaters[countryKey]) {
                        // Création de marqueurs et ajout à la carte
                        let marker = WE.marker([e.lat, e.long]).addTo(earth);
                        markers.push(marker);

                        // Ajout d'un événement de clic au marqueur
                        marker.on('click', function () {
                            // qui affiche les informations sur le théâtre sur la page
                            document.getElementById('cine-nom').textContent = `Nom du cinéma: ${e.nom}`;
                            document.getElementById('cine-annee').textContent = `Année de construction : ${e.annee}`;
                            document.getElementById('cine-ville').textContent = `Ville : ${e.ville}`;
                            document.getElementById('cine-pays').textContent = `Pays : ${e.pays}`;
                        });

                        // Indique qu'un marqueur pour ce pays a été ajouté
                        countryTheaters[countryKey] = true;
                    }
                });
            });

    }

    // Appel de la fonction markerGenerate pour initialiser les marqueurs au chargement
    markerGenerate();
}

// Appel de la fonction initialize pour configurer la carte
initialize();
