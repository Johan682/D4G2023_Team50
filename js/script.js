function restaurerDonnees() {

}

function genererPDF() {
var url = document.getElementById('urlInput').value;
console.log(url)
}

function print_JSON(){
   
   
        // Fonction pour charger et afficher les données JSON
        function chargerEtAfficherJSON() {
          // Créer une instance de XMLHttpRequest
          var xhr = new XMLHttpRequest();
    
          // Spécifier le chemin vers le fichier JSON local
          var cheminFichierJSON = '/referentiel-general-ecoconception-version-v1.json';
    
          // Configurer la requête
          xhr.open('GET', cheminFichierJSON, true);
    
          // Gérer l'événement de chargement
          xhr.onload = function() {
            if (xhr.status === 200) {
              // Parse le contenu JSON
              var donneesJSON = JSON.parse(xhr.responseText);
    
              // Afficher les données dans la page
              document.getElementById('affichage').textContent = JSON.stringify(donneesJSON, null, 2);
            } else {
              console.error('Erreur lors du chargement du fichier JSON. Statut : ' + xhr.status);
            }
          };
    
          // Gérer les erreurs réseau
          xhr.onerror = function() {
            console.error('Erreur réseau lors du chargement du fichier JSON.');
          };
    
          // Envoyer la requête
          xhr.send();
        }
    }