document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const clearSearchButton = document.getElementById("clearSearchButton");
    const playlistItems = document.querySelectorAll(".accordion");


    searchInput.addEventListener("input", function() {
        const pesquisa = searchInput.value.toLowerCase();
        playlistItems.forEach(function(item) {
            const playlistName = item.textContent.toLowerCase();
            if (playlistName.includes(pesquisa)) {
                item.parentElement.style.display = "block"; // Mostra o item da playlist
            } else {
                item.parentElement.style.display = "none"; // Oculta o item da playlist
            }
        });
    });

    // Botao Limpar
    clearSearchButton.addEventListener("click", function() {
        searchInput.value = "";
        // Mostra todos os itens da playlist novamente
        playlistItems.forEach(function(item) {
            item.parentElement.style.display = "block";
        });
    });
});