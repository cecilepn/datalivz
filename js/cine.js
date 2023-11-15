// Au clique sur un bouton, change la couleur des sièges en fonction du groupe d'âge
document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('age-button')) {
        const ageGroup = event.target.id.replace('btn-', '');
        changeAgeGroupColor(ageGroup);
    }
});
// Changement du curseur de la souris pendant le survol du siège



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
            document.getElementById('percentage-display').textContent = `${numSeatsToColor} sièges dans une salle cinéma sont pris par les ${ageGroup} ans soit ${percentage}% des entrées en moyenne de 1943 à 2022`;
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


