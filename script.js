// Fonction de chargement de la fenêtre
window.onload = function () {
    console.log("fenêtre chargée");

    // Délai pour démarrer l'effet de fondu après 1 seconde
    setTimeout(function () {
        let opacite = 1;
        // fonction diminuer progressivement l'opacité du loader
        let intervalle = setInterval(function () {
            if (opacite <= 0.1) {
                clearInterval(intervalle);
                document.querySelector(".loading").style.display = "none";
            }
            document.querySelector(".loader").style.opacity = opacite;
            // Diminue l'opacité de 10 % à chaque intervalle 
            opacite = opacite - opacite * 0.1;
        }, 60);
    }, 1000);
}

