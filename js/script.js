function url() {
    var url = document.getElementById('urlInput').value;
    if (url.trim() !== "") {
        window.location.href = url;
    }
}