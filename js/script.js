
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

                // Création du fieldset
                const fieldset = document.createElement("fieldset");
                fieldset.id = `fieldset_${field}`;

                const legend = document.createElement("legend");
                //legend.textContent = "Statut du critère";

                fieldset.appendChild(legend);

                // Création du formulaire avec des boutons radio
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

                // Ajout du formulaire à la cellule
                fieldset.appendChild(form);
                cell3.appendChild(fieldset);
            }

            data.criteres.forEach(critere => {
                addRowToTable(critere.thematique, critere.critere);
            });
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
    
}

function trierTableauParTheme() {
    const tableBody = document.querySelector("#dataTable tbody");

    // Convertir les lignes du tableau en un tableau
    const rowsArray = Array.from(tableBody.rows);

    // Trier le tableau en fonction du thème (première colonne)
    rowsArray.sort((a, b) => {
        const themeA = a.cells[0].textContent.toLowerCase();
        const themeB = b.cells[0].textContent.toLowerCase();
        return themeA.localeCompare(themeB);
    });

    // Supprimer toutes les lignes du tableau actuel
    tableBody.innerHTML = "";

    // Ajouter les lignes triées au tableau
    rowsArray.forEach(row => {
        tableBody.appendChild(row);
    });
}
document.addEventListener("DOMContentLoaded", function () {let reponsesIntermediaires = [];
    let reponseFinale = {};
    let url = document.getElementById('urlInput').value;
    

function enregistrer() {
    const tableBody = document.querySelector("#dataTable tbody");

    // Exemple : stocker les réponses intermédiaires dans un tableau
    const reponses = [];

    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const theme = row.cells[0].textContent;
        const value = row.cells[1].textContent;
        const radioInputs = row.cells[2].querySelectorAll("input[type=radio]:checked");
        const etat = radioInputs.length > 0 ? radioInputs[0].value : "";

        // Stocker les réponses intermédiaires dans un objet
        reponses.push({
            theme: theme,
            value: value,
            etat: etat,
        });
    }

    // Ajouter les réponses intermédiaires à la liste globale
    reponsesIntermediaires.push(reponses);

    // Réinitialiser le tableau pour de nouvelles réponses
    resetTable(tableBody);
}

function resetTable(tableBody) {
    // Réinitialiser le contenu du tableau
    tableBody.innerHTML = "";

    // Exemple : ajouter une ligne vide pour chaque critère
    data.criteres.forEach(critere => {
        addRowToTable(critere.thematique, critere.critere, "");
    });
}

function genpdf() {
    // Exemple : utiliser jsPDF pour générer un PDF
    const doc = new jsPDF();

    // Ajouter l'URL au PDF
    doc.text(`URL: ${url}`, 10, 10);

    // Ajouter les réponses intermédiaires au PDF
    reponsesIntermediaires.forEach((reponses, index) => {
        doc.text(`Réponses intermédiaires ${index + 1}:`, 10, 20 + index * 10);
        reponses.forEach((reponse, i) => {
            doc.text(`${i + 1}. Thème: ${reponse.theme}, Value: ${reponse.value}, État: ${reponse.etat}`, 10, 30 + index * 10 + i * 10);
        });
    });

    // Ajouter les réponses finales au PDF
    if (Object.keys(reponseFinale).length !== 0) {
        doc.text("Réponse finale:", 10, 20 + reponsesIntermediaires.length * 10);
        doc.text(`Thème: ${reponseFinale.theme}, Value: ${reponseFinale.value}, État: ${reponseFinale.etat}`, 10, 30 + reponsesIntermediaires.length * 10);
    }

    // Sauvegarder le PDF
    doc.save("export.pdf");
}
});
