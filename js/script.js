function restaurerDonnees() {

}

function genererPDF() {
var url = document.getElementById('urlInput').value;
console.log(url)
}

function addRowToTable(field, value, rowIndex) {
    const row = tableBody.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2); // Ajout de la troisième colonne

    cell1.textContent = field;
    cell2.innerHTML = value;

    // Création des choix
    const choices = ["Conforme", "En cours de déploiement", "Non conforme", "Non applicable"];

    // Ajout des choix en tant que boutons radio
    choices.forEach((choiceText, index) => {
        const radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = `etat_${field.replace(/ /g, "_")}_${rowIndex}`;
        radioBtn.value = choiceText.toLowerCase().replace(/ /g, "_");
        radioBtn.id = `etat_${field.replace(/ /g, "_")}_${choiceText.toLowerCase().replace(/ /g, "_")}_${rowIndex}`;
        
        // Ajout du bouton radio à la cellule
        cell3.appendChild(radioBtn);

        // Création de l'étiquette pour le bouton radio
        const label = document.createElement("label");
        label.htmlFor = `etat_${field.replace(/ /g, "_")}_${choiceText.toLowerCase().replace(/ /g, "_")}_${rowIndex}`;
        label.textContent = choiceText;

        // Ajout de l'étiquette à la cellule
        cell3.appendChild(label);
    });
}

data.criteres.forEach((critere, index) => {
    addRowToTable(critere.thematique, critere.critere, index);
});
