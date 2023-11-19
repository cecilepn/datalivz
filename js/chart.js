// Graphique linéaire sur la fréquentation des salles de cinéma en France par année de 1943 à 2022

(async function () {
    // Récupération des données du fichier JSON
    const response = await fetch('./json/entries.json');
    const jsonData = await response.json();

    // Extraction des données : année et nombre d'entrées
    const data = jsonData.map(item => ({
        year: item.annee,
        count: item.entrees,
        explaination: item.desc
    }));

    // Création du graphique avec chart.js

    const graphData = {
        labels: [],
        datasets: [
            {
                label: 'Entrées par année en millions',
                data: [],
                borderColor: '#03C7F7',
                borderWidth: 2,
                Radius: 4,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: '#03C7F7',
            },
        ],
    };

    const graphOptions = {
        responsive: true,
        maintainAspectRatio: false,
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

        // Fonction changeant la couleur des points dont l'année est clé uniquement
        graphData.datasets[0].pointBackgroundColor = graphData.labels.map(year => {
            if ([1943, 1944, 1945, 1946, 1947, 1950, 1952, 1953, 1957, 1958, 1971, 1984, 1990, 1997, 2001, 2005, 2009, 2010, 2015, 2019, 2020, 2022].includes(parseInt(year))) {
                return '#03C7F7';  // Couleur rouge pour les années spécifiques
            } else {
                return '#000000';  // Couleur par défaut
            }
        });
    }

    // Mettre à jour le graphique toutes les x millisecondes (soit toutes les secondes)
    animationInterval = setInterval(updateGraphAndInfo, 900);

    // Arrête l'animation
    document.getElementById('stopAnimationButton').addEventListener('click', () => {
        clearInterval(animationInterval);

        // Afficher le graphique complet en mettant à jour les données une dernière fois

        while (currentYearIndex < data.length) {
            updateGraphAndInfo();
        }


        //Change le curseur de la souris lorsqu'il survole le graphique 
        graph1.canvas.addEventListener('mousemove', (event) => {
            const activePoints = graph1.getElementsAtEvent(event);

            if (activePoints.length > 0) {
                graph1.canvas.style.cursor = 'pointer';
            } else {
                graph1.canvas.style.cursor = 'default';
            }
        });

        // Affiche les données du point cliqué dans la div avec l'id "info"
        graph1.canvas.addEventListener('click', (event) => {
            const activePoints = graph1.getElementsAtEvent(event);

            if (activePoints.length > 0) {
                const clickedIndex = activePoints[0]._index;
                const clickedYear = graphData.labels[clickedIndex];
                const clickedCount = graphData.datasets[0].data[clickedIndex];
                const explaination = data[clickedIndex].explaination;

                document.getElementById('currentYear').textContent = `${clickedYear}`;
                document.getElementById('currentCount').textContent = `${clickedCount}`;
                document.getElementById('explication').textContent = `${explaination}`;

            }


        });

        // Réinitialiser le curseur lorsque la souris quitte le graphique
        graph1.canvas.addEventListener('mouseout', () => {
            graph1.canvas.style.cursor = 'default';
        });

    });

    // Afficher les informations initiales
    updateGraphAndInfo();
})();