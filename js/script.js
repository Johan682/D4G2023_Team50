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
            const tableBody = document.querySelector("#dataTable tbody");

            function addRowToTable(field, value) {
                const row = tableBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);

                cell1.textContent = field;
                cell2.innerHTML = value;

                const fieldset = document.createElement("fieldset");
                fieldset.id = `fieldset_${field}`;

                const legend = document.createElement("legend");

                fieldset.appendChild(legend);

                const form = document.createElement("form");
                form.id = `radioGroup_${field}`;

                const options = ["conforme", "en cours de deploiement", "non conforme", "nonapplicable"];

                options.forEach(optionText => {
                    const label = document.createElement("label");
                    const radioInput = document.createElement("input");

                    radioInput.type = "radio";
                    radioInput.name = `radio_${field}`;
                    radioInput.value = optionText.toLowerCase();

                    label.appendChild(radioInput);
                    label.appendChild(document.createTextNode(` ${optionText}`));

                    form.appendChild(label);
                });

                fieldset.appendChild(form);
                cell3.appendChild(fieldset);
            }

            data.criteres.forEach(critere => {
                addRowToTable(critere.thematique, critere.critere);
            });

            // Appel de la fonction de tri après avoir chargé les données
            trierTableauAlphabetique();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}




function calculerScore() {
    const tableBody = document.querySelector("#dataTable tbody");

    let critereConforme = 0;
    let critereNonApplicable = 0;

    // Parcours des lignes du tableau
    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const radioInputs = row.cells[2].querySelectorAll("input[type=radio]:checked");

        // Si un bouton radio est sélectionné
        if (radioInputs.length > 0) {
            const selectedValue = radioInputs[0].value;

            // Si le critère est conforme
            if (selectedValue === "conforme") {
                critereConforme++;
            }

            // Si le critère est non applicable
            if (selectedValue === "nonapplicable") {
                critereNonApplicable++;
            }
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
    
        const scoreButton = document.getElementById("score");
        const dropdownList = document.getElementById("etatFilter");
    
        // Ajouter un gestionnaire d'événement de clic au bouton
        scoreButton.addEventListener("click", function () {
            //dropdownList.style.display = "none";
            // Afficher ou masquer la liste déroulante en fonction de son état actuel
            if (dropdownList.style.display === "none" || dropdownList.style.display === "") {
                dropdownList.style.display = "block";
            } else {
                dropdownList.style.display = "none";
            }
        });
    

}
function filtrerCriteres() {
    const tableBody = document.querySelector("#dataTable tbody");
    const themeFilter = document.getElementById("themeFilter").value.toLowerCase(); // Converti en minuscules
    const etatFilter = document.getElementById("etatFilter").value; // Converti en minuscules

    // Parcours des lignes du tableau
    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const themeValue = row.cells[0].textContent.toLowerCase().replace(/ /g, "_"); // Converti en minuscules
        const etatInputs = row.cells[2].querySelectorAll("input[type=radio]:checked");
        const etatValue = etatInputs.length > 0 ? etatInputs[0].value : "";

        // Affiche ou masque la ligne en fonction des filtres sélectionnés
        const afficherLigne =
            (themeFilter === "toutes" || themeFilter === themeValue) &&
            (etatFilter === "tous" || etatFilter === etatValue);

        // Met à jour la visibilité de la ligne
        row.style.display = afficherLigne ? "" : "none";
    }
    function trierTableauAlphabetique() {
        const tableBody = document.querySelector("#dataTable tbody");
        const rows = Array.from(tableBody.rows);
    
        // Tri des lignes en fonction du contenu de la première colonne (Thématique)
        rows.sort((a, b) => {
            const themeA = a.cells[0].textContent.toLowerCase();
            const themeB = b.cells[0].textContent.toLowerCase();
            return themeA.localeCompare(themeB);
        });
    
        // Suppression de toutes les lignes du tableau
        rows.forEach(row => tableBody.removeChild(row));
    
        // Ajout des lignes triées au tableau
        rows.forEach(row => tableBody.appendChild(row));
    }
    

}

