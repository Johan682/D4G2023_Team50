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
