function restaurerDonnees() {

}

function genererPDF() {
var url = document.getElementById('urlInput').value;

}

function print_JSON(){
    const urlFichierJSON = '"/referentiel-general-ecoconception-version-v1.json"';

    // Utilisation de la fonction fetch pour récupérer le fichier JSON
    fetch(urlFichierJSON)
      .then(response => {
        // Vérifier si la réponse est réussie (statut 200 OK)
        if (!response.ok) {
          throw new Error(`Impossible de récupérer le fichier JSON. Statut ${response.status}`);
        }
    
        // Parse la réponse en tant qu'objet JSON et retourne la promesse
        return response.json();
      })
      .then(data => {
        // Traiter les données JSON
        afficherDonnees(data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du fichier JSON :', error.message);
      });
    
    // Fonction pour afficher les données
    function afficherDonnees(data) {
      // Supposons que les données sont un objet JSON simple
      // Vous pouvez personnaliser cette fonction en fonction de la structure de vos données
      console.log('Contenu du fichier JSON :', data);
      
      // Afficher les données dans le document HTML
      const contenuDiv = document.getElementById('contenu');
      contenuDiv.textContent = JSON.stringify(data, null, 2);
    }

}