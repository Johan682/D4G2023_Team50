function url() {
    if (url.trim() !== "") {
        var url = document.getElementById('urlInput').value;
    }
    else {
        alert("Veuillez rentrer une valeur pour votre url")
    }
}