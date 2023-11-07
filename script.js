// Graphique linéaire sur la fréquentation des salles de cinéma en France par année de 1943 à 2022

(async function () {
    // Récupération des données du fichier JSON
    const response = await fetch('./json/entries.json');
    const jsonData = await response.json();

    // Extraction des données : année et nombre d'entrées
    const data = jsonData.map(item => ({
        year: item.annee,
        count: item.entrees
    }));

    // Création du graphique avec chart.js

    const graphData = {
        labels: [],
        datasets: [
            {
                label: 'Entrées par année',
                data: [],
                borderColor: '#03C7F7',
                borderWidth: 3,

            },
        ],
    };

    const graphOptions = {
        responsive: true,
        maintainAspectRatio: false, // Permet de ne pas déformer le graphique
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },

    };

    // Création du graphique initial avec la première année
    const ctx = document.getElementById('graph1').getContext('2d');
    const graph1 = new Chart(ctx, {
        type: 'line',
        data: graphData,
        options: graphOptions,
    });

    let currentYearIndex = 0;
    let animationInterval;

    // Fonction pour mettre à jour le graphique et les informations
    function updateGraphAndInfo() {
        if (currentYearIndex < data.length) {
            graphData.labels.push(data[currentYearIndex].year);
            graphData.datasets[0].data.push(data[currentYearIndex].count);
            graph1.update();

            document.getElementById('currentYear').textContent = data[currentYearIndex].year;
            document.getElementById('currentCount').textContent = data[currentYearIndex].count;

            currentYearIndex++;
        } else {
            clearInterval(animationInterval); // Arrête l'animation à la fin des données
        }
    }

    // Mettre à jour le graphique toutes les x millisecondes (soit toutes les secondes)
    animationInterval = setInterval(updateGraphAndInfo, 1000);

    // Gestionnaire de clic sur le bouton "Arrêter l'animation"
    document.getElementById('stopAnimationButton').addEventListener('click', () => {
        clearInterval(animationInterval); // Arrête l'animation
        // Afficher le graphique complet en mettant à jour les données une dernière fois
        while (currentYearIndex < data.length) {
            updateGraphAndInfo();
        }
    });

    // Afficher les informations initiales
    updateGraphAndInfo();
})();


// Au clique sur un bouton, change la couleur des sièges en fonction du groupe d'âge
document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('age-button')) {
        const ageGroup = event.target.id.replace('btn-', '');
        changeAgeGroupColor(ageGroup);
    }
});

// Fonction pour changer la couleur en fonction du groupe d'âge
function changeAgeGroupColor(ageGroup) {
    // Requête pour obtenir les données à partir du fichier JSON 'age.json'
    fetch('./json/age.json')
        .then(response => response.json())
        .then(data => {
            // Recherche les données pour le groupe d'âge correspondant
            const ageData = data.find(item => item.population === ageGroup);

            // Extrait le pourcentage et la couleur
            const percentage = ageData.moyenne;
            const color = ageData.color;

            // Sélectionne tous les éléments avec la classe 'seat'
            const seats = document.querySelectorAll('.seat');

            // Calcule le nombre de sièges à colorier en fonction du pourcentage
            const numSeats = seats.length;
            const numSeatsToColor = Math.round((percentage / 100) * numSeats);

            // Génère des indices aléatoires pour sélectionner les sièges à colorier
            const randomIndices = getRandomIndices(numSeats, numSeatsToColor);

            // Parcourt les sièges et attribue la couleur en fonction des indices aléatoires
            seats.forEach((seat, index) => {
                if (randomIndices.includes(index)) {
                    seat.setAttribute('fill', color);
                } else {
                    seat.setAttribute('fill', 'black');
                }
            });

            // Met à jour l'élément d'affichage du pourcentage
            document.getElementById('percentage-display').textContent = `${numSeatsToColor} sièges dans une salle cinéma sont pris par les ${ageGroup} soit ${percentage}% des entrées en moyenne de 1943 à 2022`;
        })
        .catch(error => {
            console.error('Une erreur s\'est produite : ', error);
        });
}


// Fonction pour générer des indices aléatoires
function getRandomIndices(total, count) {
    // Crée un tableau d'indices de 0 à total - 1
    const indices = Array.from({ length: total }, (_, i) => i);

    // Mélange les indices de manière aléatoire 
    for (let i = total - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Retourne un sous-ensemble des indices mélangés
    return indices.slice(0, count);
}


