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

                // Création du formulaire avec des boutons radio
                const form = document.createElement("form");

                const options = ["Conforme", "En cours de déploiement", "Non conforme", "Non applicable"];

                options.forEach((optionText, index) => {
                    const label = document.createElement("label");
                    const radioInput = document.createElement("input");

                    radioInput.type = "radio";
                    radioInput.name = `radio_${field}`;
                    radioInput.value = optionText.toLowerCase().replace(/ /g, "_");
                    radioInput.id = `radio_${field}_${index + 1}`;

                    label.appendChild(radioInput);
                    label.appendChild(document.createTextNode(` ${optionText}`));
                    label.setAttribute("for", `radio_${field}_${index + 1}`);

                    form.appendChild(label);
                });

                // Ajout du formulaire à la cellule
                cell3.appendChild(form);
            }

            data.criteres.forEach(critere => {
                addRowToTable(critere.thematique, critere.critere);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}
