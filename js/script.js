function restaurerDonnees() {

}

function genererPDF() {
var url = document.getElementById('urlInput').value;
console.log(url)
}

function chargementpage() {
    fetch("referentiel-general-ecoconception-version-v1.json")
        .then(response => response.json())
        .then(data => {
            // Get the table body to populate data
            const tableBody = document.querySelector("#dataTable tbody");

            // Function to add a row to the table
            function addRowToTable(field, value) {
                const row = tableBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2); // Ajout de la troisième colonne

                cell1.textContent = field;
                cell2.innerHTML = value;

                // Création du menu déroulant
                const select = document.createElement("select");
                select.name = "etat";
                const options = ["","Conforme", "En cours de déploiement", "Non conforme", "Non applicable"];

                // Ajout des options au menu déroulant
                options.forEach(optionText => {
                    const option = document.createElement("option");
                    option.value = optionText.toLowerCase().replace(/ /g, "_");
                    option.text = optionText;
                    select.add(option);
                });

                // Ajout du menu déroulant à la cellule
                cell3.appendChild(select);
            }

            data.criteres.forEach(critere => {
                addRowToTable(critere.thematique, critere.critere);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        }); }
        function calculerScore() {
            const tableBody = document.querySelector("#dataTable tbody");
        
            let critereConforme = 0;
            let critereNonApplicable = 0;
        
            // Parcours des lignes du tableau
            for (let i = 0; i < tableBody.rows.length; i++) {
                const row = tableBody.rows[i];
                const select = row.cells[2].querySelector("select");
                const selectedValue = select.options[select.selectedIndex].value;
        
                // Si le critère est conforme
                if (selectedValue === "conforme") {
                    critereConforme++;
                }
        
                // Si le critère est non applicable
                if (selectedValue === "non_applicable") {
                    critereNonApplicable++;
                }
            }
        
            // Total des critères (79)
            const totalCritere = 79;
        
            // Calcul du score de conformité
            const score = critereConforme / (totalCritere - critereNonApplicable);
            // Affichage du score dans l'élément HTML
            const scoreContainer = document.getElementById("scoreContainer");

            // Mise à jour du contenu de l'élément avec le score
            scoreContainer.innerHTML = score.toFixed(2); // pour afficher le score avec deux décimales
        
            // Affichage du score dans la console (à adapter selon tes besoins)
        }