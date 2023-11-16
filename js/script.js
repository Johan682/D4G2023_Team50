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

                const options = ["conforme", "en cours de déploiement", "non conforme", "non applicable"];

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
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function calculerScore() {
    const tableBody = document.querySelector("#dataTable tbody");
    const scoreButton = document.getElementById("score");
    const dropdownList = document.getElementById("etatFilter");

    let critereConforme = 0;
    let critereNonApplicable = 0;

    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const radioInputs = row.cells[2].querySelectorAll("input[type=radio]:checked");

        if (radioInputs.length > 0) {
            const selectedValue = radioInputs[0].value;

            if (selectedValue === "conforme") {
                critereConforme++;
            }

            if (selectedValue === "nonapplicable") {
                critereNonApplicable++;
            }
        }
    }

    const totalCritere = 79;

    const score = critereConforme / (totalCritere - critereNonApplicable);

    const scoreContainer = document.getElementById("scoreContainer");

    scoreContainer.innerHTML = score.toFixed(2);

    if (dropdownList.style.display === "none" || dropdownList.style.display === "") {
        dropdownList.style.display = "block";
    } else {
        dropdownList.style.display = "none";
    }
}

function filtrerCriteres() {
    const tableBody = document.querySelector("#dataTable tbody");
    const themeFilter = document.getElementById("themeFilter").value.toLowerCase();
    const etatFilter = document.getElementById("etatFilter").value;

    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const themeValue = row.cells[0].textContent.toLowerCase().replace(/ /g, "_");
        const etatInputs = row.cells[2].querySelectorAll("input[type=radio]:checked");
        const etatValue = etatInputs.length > 0 ? etatInputs[0].value : "";

        const afficherLigne =
            (themeFilter === "toutes" || themeFilter === themeValue) &&
            (etatFilter === "tous" || etatFilter === etatValue);

        row.style.display = afficherLigne ? "" : "none";
    }
}

function trierTableauParTheme() {
    const tableBody = document.querySelector("#dataTable tbody");

    const rowsArray = Array.from(tableBody.rows);

    rowsArray.sort((a, b) => {
        const themeA = a.cells[0].textContent.toLowerCase();
        const themeB = b.cells[0].textContent.toLowerCase();
        return themeA.localeCompare(themeB);
    });

    tableBody.innerHTML = "";

    rowsArray.forEach(row => {
        tableBody.appendChild(row);
    });
}

function trierCriteres(etat) {
    const tableBody = document.querySelector("#dataTable tbody");

    const rowsArray = Array.from(tableBody.rows);

    rowsArray.sort((a, b) => {
        const etatA = a.cells[2].querySelector(`input[type=radio][value=${etat}]`);
        const etatB = b.cells[2].querySelector(`input[type=radio][value=${etat}]`);

        if (!etatA && !etatB) return 0;
        if (!etatA) return 1;
        if (!etatB) return -1;

        return etatA.compareDocumentPosition(etatB) === Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    tableBody.innerHTML = "";

    rowsArray.forEach(row => {
        tableBody.appendChild(row);
    });
}

let reponsesIntermediaires = [];
let reponseFinale = {};

function enregistrer() {
    const tableBody = document.querySelector("#dataTable tbody");

    const reponses = [];

    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const theme = row.cells[0].textContent;
        const value = row.cells[1].textContent;
        const radioInputs = row.cells[2].querySelectorAll("input[type=radio]:checked");
        const etat = radioInputs.length > 0 ? radioInputs[0].value : "";

        reponses.push({
            theme: theme,
            value: value,
            etat: etat,
        });
    }

    reponsesIntermediaires.push(reponses);
    console.log();

    resetTable(tableBody);
}

function resetTable(tableBody) {
    tableBody.innerHTML = "";

    data.criteres.forEach(critere => {
        addRowToTable(critere.thematique, critere.critere, "");
        console.log();
    });
}

function exportToPdf() {
    const element = document.body;

    const options = {
        margin: 5,
        filename: 'rapport_audit.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2  },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf(element, options);
}
