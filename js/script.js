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

                // Création du fieldset
                const fieldset = document.createElement("fieldset");
                fieldset.id = `fieldset_${field}`;

                const legend = document.createElement("legend");
                //legend.textContent = "Statut du critère";

                fieldset.appendChild(legend);

                // Création du formulaire avec des boutons radio
                const form = document.createElement("form");
                form.id = `radioGroup_${field}`;

                const options = ["Conforme", "En cours de déploiement", "Non conforme", "Non applicable"];

                options.forEach(optionText => {
                    const label = document.createElement("label");
                    const radioInput = document.createElement("input");

                    radioInput.type = "radio";
                    radioInput.name = `radio_${field}`;
                    radioInput.value = optionText.toLowerCase().replace(/ /g, "_");

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

function filtrerParTheme() {
    const themeFilter = document.getElementById("themeFilter");
    const selectedTheme = themeFilter.value.toLowerCase();

    const rows = document.querySelectorAll("#dataTable tbody tr");

    rows.forEach(row => {
        const theme = row.cells[0].textContent.toLowerCase();
        row.style.display = selectedTheme === "tous" || theme === selectedTheme ? "" : "none";
    });
}

function filtrerParEtat() {
    const stateFilter = document.getElementById("stateFilter");
    const selectedState = stateFilter.value;

    const rows = document.querySelectorAll("#dataTable tbody tr");

    rows.forEach(row => {
        const radioInputs = row.cells[2].querySelectorAll("input[type=radio]:checked");
        const state = radioInputs.length > 0 ? radioInputs[0].value : "";

        row.style.display = selectedState === "tous" || state === selectedState ? "" : "none";
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
            if (selectedValue === "non_applicable") {
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

    // Affichage du score dans la console (à adapter selon tes besoins)
    console.log("Score de conformité:", score);
}
