
// Déclare un objet pour stocker les réponses partielles
let reponsesPartielles = [];

// Fonction pour enregistrer les réponses partielles
function enregistrer() {
    const tableBody = document.querySelector("#dataTable tbody");
    const reponses = [];

    // Parcours des lignes du tableau
    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const theme = row.cells[0].textContent;
        const etatInputs = row.cells[2].querySelectorAll("input[type=radio]:checked");
        const etat = etatInputs.length > 0 ? etatInputs[0].value : "";

        // Ajoute la réponse partielle à la liste
        reponses.push({ theme, etat });
    }

    // Ajoute les réponses partielles à l'objet global
    reponsesPartielles.push(reponses);

    // Réinitialise le tableau pour la prochaine saisie
    resetTable();
}

// Fonction pour générer le PDF à partir des réponses partielles
function genererPDF() {
    const pdf = new jsPDF();

    // Parcours des réponses partielles
    reponsesPartielles.forEach((ensembleReponses, index) => {
        // Ajoute l'URL au PDF
        pdf.text(`URL : ${ensembleReponses.url}`, 10, 10);

        // Ajoute les réponses au PDF
        pdf.text(`Réponses Partielles ${index + 1}`, 10, 20);
        ensembleReponses.reponses.forEach((reponse, i) => {
            pdf.text(`${i + 1}. ${reponse.theme}: ${reponse.etat}`, 10, 30 + i * 10);
        });

        // Ajoute une nouvelle page pour les réponses suivantes
        if (index !== reponsesPartielles.length - 1) {
            pdf.addPage();
        }
    });

    // Télécharge le PDF
    pdf.save("reponses_partielles.pdf");
}

// Fonction pour réinitialiser le tableau
function resetTable() {
    const tableBody = document.querySelector("#dataTable tbody");

    // Supprimer toutes les lignes du tableau
    tableBody.innerHTML = "";

    // Ajouter les lignes initiales au tableau
    chargementpage();
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
