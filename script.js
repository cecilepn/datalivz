// Graphique linéaire sur la fréquentation des salles de cinéma en France par année de 1943 à 2022

(async function () {
    // Récupération des données du fichier json 
    const response = await fetch('./json/entries.json');
    const jsonData = await response.json();

    // Extraction des données qui nous intéressent ici : année et nombre d'entrées
    const data = jsonData.map(item => ({
        year: item.annee,
        count: item.entrees
    })); console.log(data)



    // Création du graphique avec la librairie Chart.js
    new Chart(
        document.getElementById('graph1'),
        {
            type: 'line',
            data: {
                labels: data.map(row => row.year),
                datasets: [
                    {
                        label: 'Entrées par année',
                        data: data.map(row => row.count),
                        borderColor: '#03C7F7',
                    }
                ]
            }
        }
    );
})();