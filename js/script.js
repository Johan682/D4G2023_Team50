
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
    const score = (critereConforme / (totalCritere - critereNonApplicable))*100;
    
    // Affichage du score dans l'élément HTML
    const scoreContainer = document.getElementById("scoreContainer");
    scoreContainer.innerHTML = score.toFixed(1) +" "+ "%"; // pour afficher le score avec deux décimales
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

// Fonction pour récupérer les états intermédiaires depuis le tableau
function recupereEtatsIntermediaires() {
    const tableBody = document.querySelector("#dataTable tbody");
    const etatsIntermediaires = [];

    // Parcours des lignes du tableau
    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const theme = row.cells[0].textContent;
        const value = row.cells[1].textContent;
        const radioInputs = row.cells[2].querySelectorAll("input[type=radio]:checked");
        const etat = radioInputs.length > 0 ? radioInputs[0].value : "";

        // Stocker l'état intermédiaire dans un objet
        etatsIntermediaires.push({
            theme: theme,
            value: value,
            etat: etat,
        });
    }

    return etatsIntermediaires;
}


// Ajoutez une fonction pour sauvegarder les états intermédiaires
function sauvegarderEtatsIntermediaires() {
    // Récupérez les états intermédiaires depuis le tableau
    const etatsIntermediaires = recupereEtatsIntermediaires();
    // Enregistrez les états intermédiaires dans le Local Storage
    localStorage.setItem('etatsIntermediaires', JSON.stringify(etatsIntermediaires));
}

// Fonction pour restaurer les états intermédiaires depuis le Local Storage
function restaurerEtatsIntermediaires() {
    const savedData = localStorage.getItem('etatsIntermediaires');
    if (savedData) {
        const etatsIntermediaires = JSON.parse(savedData);
        // Restaurez les états intermédiaires dans le tableau
        restoreEtatsIntermediaires(etatsIntermediaires);
        // Effacez les données du Local Storage après la restauration
        localStorage.removeItem('etatsIntermediaires');
    } else {
        //alert("Aucune donnée à restaurer.");
    }
}

// Fonction pour restaurer les états intermédiaires dans le tableau
function restoreEtatsIntermediaires(etatsIntermediaires) {
    const tableBody = document.querySelector("#dataTable tbody");
    // Effacez le contenu actuel du tableau
    tableBody.innerHTML = "";

    // Ajoutez chaque état intermédiaire au tableau
    etatsIntermediaires.forEach(etat => {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.textContent = etat.theme;
        cell2.textContent = etat.value;

        // Créez le fieldset
        const fieldset = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.textContent = "Statut du critère";
        fieldset.appendChild(legend);

        // Créez le formulaire avec des boutons radio
        const form = document.createElement("form");
        form.id = `radioGroup_${etat.theme.toLowerCase().replace(/ /g, "_")}`;

        const options = ["conforme", "en cours de deploiement", "non conforme", "nonapplicable"];

        options.forEach(optionText => {
            const label = document.createElement("label");
            const radioInput = document.createElement("input");

            radioInput.type = "radio";
            radioInput.name = `radio_${etat.theme}`;
            radioInput.value = optionText.toLowerCase();

            label.appendChild(radioInput);
            label.appendChild(document.createTextNode(` ${optionText}`));

            form.appendChild(label);
        });

        // Sélectionnez le bouton radio enregistré
        form.querySelector(`input[value="${etat.etat}"]`).checked = true;

        // Ajoutez le formulaire à la cellule
        fieldset.appendChild(form);
        cell3.appendChild(fieldset);
    });
}

// Restaurer les états intermédiaires au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    restaurerEtatsIntermediaires();
});

// Appeler cette fonction lorsque vous souhaitez restaurer les états intermédiaires
function restaurer() {
    restaurerEtatsIntermediaires();
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

    // Fonction de comparaison personnalisée
    function compareRows(a, b) {
        const etatA = a.cells[2].querySelector(`input[value=${etatSorte}]`);
        const etatB = b.cells[2].querySelector(`input[value=${etatSorte}]`);

        if (etatA && etatB) {
            return etatA.checked ? -1 : 1;
        } else if (etatA) {
            return -1; // Seul a a l'état spécifié, donc il va en haut
        } else if (etatB) {
            return 1; // Seul b a l'état spécifié, donc il va en haut
        } else {
            return 0; // Les deux sont vides, pas de changement d'ordre
        }
    }

    // Trier le tableau en utilisant la fonction de comparaison personnalisée
    rowsArray.sort(compareRows);

    // Créer un objet pour stocker les lignes triées par état
    const groupedRows = {
        [etatSorte]: [],
        'other': [],
        'empty': []
    };

    // Ajouter les lignes triées à l'objet en utilisant l'état comme clé
    rowsArray.forEach(row => {
        const etat = row.cells[2].querySelector(`input[value=${etatSorte}]`);
        const etatValue = etat ? (etat.checked ? etatSorte : 'other') : 'empty';

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

function appelfonctiontrier() {
    trierParEtat("conforme");
    trierParEtat("encoursdedeploiement");
    trierParEtat("nonconforme");
    trierParEtat("nonapplicable");
    trierParEtat();
}