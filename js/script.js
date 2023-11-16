
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
    const scoreButton = document.getElementById("score");
    const dropdownList = document.getElementById("etatFilter");
    const button = document.getElementById("filtrer");

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

    scoreContainer.innerHTML = score.toFixed(2); // pour afficher le score avec deux décimales
    
    // Afficher la liste déroulante
    dropdownList.style.display = "block";
    // Afficher le bouton de tri
    button.style.display = "block";


    
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

// Ajoutez une fonction pour sauvegarder les états intermédiaires
function sauvegarderEtatsIntermediaires() {
    // Récupérez les états intermédiaires depuis le tableau
    const etatsIntermediaires = recupereEtatsIntermediaires();

    // Enregistrez les états intermédiaires dans IndexedDB
    enregistrerEtatsIntermediaires(etatsIntermediaires);
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

// Fonction pour enregistrer les états intermédiaires dans IndexedDB
function enregistrerEtatsIntermediaires(etatsIntermediaires) {
    const request = window.indexedDB.open("EtatsIntermediairesDB", 1);

    request.onerror = function (event) {
        console.error("Erreur lors de l'ouverture de la base de données :", event.target.errorCode);
    };

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Commencez une transaction de lecture/écriture
        const transaction = db.transaction(["etatsIntermediaires"], "readwrite");
        const objectStore = transaction.objectStore("etatsIntermediaires");

        // Ajoutez chaque état intermédiaire à l'object store
        etatsIntermediaires.forEach(etat => {
            const request = objectStore.add(etat);

            request.onsuccess = function (event) {
                console.log("État intermédiaire enregistré avec succès");
            };

            request.onerror = function (event) {
                console.log("Erreur lors de l'enregistrement de l'état intermédiaire :", event.target.errorCode);
            };
        });
    };

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Créez un object store si nécessaire
        if (!db.objectStoreNames.contains("etatsIntermediaires")) {
            db.createObjectStore("etatsIntermediaires", { keyPath: "id", autoIncrement: true });
        }
    };
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


function trierCriteres() {
    const tableBody = document.querySelector("#dataTable tbody");
    const themeSort = document.getElementById("themeSort").value;

    // Convertit la collection de lignes en un tableau pour pouvoir le trier
    const rowsArray = Array.from(tableBody.rows);

    // Trie le tableau en fonction de la première colonne (thème)
    rowsArray.sort((a, b) => {
        const themeA = a.cells[0].textContent.toLowerCase();
        const themeB = b.cells[0].textContent.toLowerCase();
        return themeSort === 'asc' ? themeA.localeCompare(themeB) : themeB.localeCompare(themeA);
    });

    // Efface le contenu du tableau
    tableBody.innerHTML = "";

    // Ajoute les lignes triées au tableau
    rowsArray.forEach(row => {
        tableBody.appendChild(row);
    });
}
