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
