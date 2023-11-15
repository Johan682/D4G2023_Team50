function url() {
    var url = document.getElementById('urlInput').value;
    if (url.trim() !== "") {
        alert("Hello, ceci est un message en JavaScript !");
    }
    else {
        alert("Veuillez rentrer une valeur pour votre url")
    }
}