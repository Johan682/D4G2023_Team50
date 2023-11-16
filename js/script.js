
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

                const options = ["conforme", "encoursdedeploiement", "nonconforme", "nonapplicable"];

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
    const scoreButton = document.getElementById("score");
    const dropdownList = document.getElementById("etatFilter");
    const dropdownList2 = document.getElementById("etatSorte");
    let critereConforme = 0;
    let critereNonApplicable = 0; 
    for (let i = 0; i < tableBody.rows.length; i++) { // Parcours des lignes du tableau
        const row = tableBody.rows[i];
        const radioInputs = row.cells[2].querySelectorAll("input[type=radio]:checked"); // Si un bouton radio est sélectionné
        if (radioInputs.length > 0) {
            const selectedValue = radioInputs[0].value; 
            if (selectedValue === "conforme") { // Si le critère est conforme
                critereConforme++;}
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
    scoreContainer.innerHTML = score.toFixed(2); // pour afficher le score avec deux décimales
    dropdownList.style.display = "block"; // Afficher la liste déroulante
    dropdownList2.style.display ="block" // Afficher la liste déroulante
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

function enregistrerEtatsIntermediaires(etatsIntermediaires) {
    // Vérifiez si le localStorage est pris en charge par le navigateur
    if (typeof(Storage) !== "undefined") {
        // Récupérez les données existantes ou initialisez un tableau vide
        const data = JSON.parse(localStorage.getItem('etatsIntermediaires')) || [];

        // Ajoutez chaque état intermédiaire au tableau
        etatsIntermediaires.forEach(etat => {
            data.push(etat);
        });

        // Stockez le tableau mis à jour dans le localStorage
        localStorage.setItem('etatsIntermediaires', JSON.stringify(data));

        console.log("États intermédiaires enregistrés avec succès dans le localStorage");
    } else {
        console.error("Le localStorage n'est pas pris en charge par votre navigateur.");
    }
}
function exportToPdf() {
  // Sélectionnez l'élément à convertir en PDF
  const element = document.body;
  // Options pour la conversion en PDF
  const options = {
      margin: 5,
      filename: 'rapport_audit.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2  },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  // Utilisez html2pdf pour générer le PDF
  html2pdf(element, options);
}

function trierParEtat() {
    const tableBody = document.querySelector("#dataTable tbody");
    const etatSorte = document.getElementById("etatSorte").value;
    
    // Convertir les lignes du tableau en un tableau
    const rowsArray = Array.from(tableBody.rows);

    // Trier le tableau en fonction de l'état sélectionné
    rowsArray.sort((a, b) => {
        const etatA = a.cells[2].querySelector(`input[value=${etatSorte}]`);
        const etatB = b.cells[2].querySelector(`input[value=${etatSorte}]`);
        if (etatA && etatB) {
            return etatA.checked ? -1 : 1;
        } else if (etatA) {
            return -1;
        } else if (etatB) {
            return 1;
        } else {
            return 0;
        }
    });

    // Créer un objet pour stocker les lignes triées par état
    const groupedRows = {};

    // Ajouter les lignes triées à l'objet en utilisant l'état comme clé
    rowsArray.forEach(row => {
        const etat = row.cells[2].querySelector(`input[value=${etatSorte}]`);
        const etatValue = etat ? etat.value : 'other';
        if (!groupedRows[etatValue]) {
            groupedRows[etatValue] = [];
        }
        groupedRows[etatValue].push(row);
    });

    // Supprimer toutes les lignes du tableau actuel
    tableBody.innerHTML = "";

    // Ajouter les lignes triées par état au tableau
    Object.values(groupedRows).forEach(rows => {
        rows.forEach(row => {
            tableBody.appendChild(row);
        });
    });
}