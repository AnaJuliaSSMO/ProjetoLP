document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const listaMusicas = document.getElementById("listaMusicas");
    const musicasOriginais = Array.from(listaMusicas.getElementsByTagName("li"));

    // Função para fazer a pesquisa
    function pesquisarMusicas() {
        const pesquisa = searchInput.value.toLowerCase();

        for (let i = 0; i < musicasOriginais.length; i++) {
            const musica = musicasOriginais[i];
            const nomeArtista = musica.textContent.toLowerCase();
            if (nomeArtista.includes(pesquisa)) {
                musica.style.display = "block";
            } else {
                musica.style.display = "none";
            }
        }
    }

    // Campo de pesquisa
    searchInput.addEventListener("input", function () {
        pesquisarMusicas();
    });

    // Função para atualizar a quantidade de músicas
    function atualizarQuantidadeMusicas() {
        const musicasExibidas = Array.from(listaMusicas.getElementsByTagName("li")).filter(musica => musica.style.display !== "none");
        document.getElementById("quantidadeMusicas").textContent = `QUANTIDADE DE MÚSICAS: ${musicasExibidas.length}`;
    }

    // Atualizat a quantidade de músicas sempre que a pesquisa for feita
    searchInput.addEventListener("input", function () {
        pesquisarMusicas();
        atualizarQuantidadeMusicas();
    });
	
	
    atualizarQuantidadeMusicas();
	
	

//-----------------------------------------------------------BOTOES---------------------------------------------------------------------
	
   // Botões "Detalhes"
    const detalhesButtons = document.getElementsByClassName("detalhes");
    const detalhesMusicaContainers = document.getElementsByClassName("detalhes-musica");

    for (let i = 0; i < detalhesButtons.length; i++) {
        detalhesButtons[i].addEventListener("click", function () {
            const detalhesContainer = detalhesMusicaContainers[i];
            if (detalhesContainer.style.display === "none" || detalhesContainer.style.display === "") {
                detalhesContainer.style.display = "block";
            } else {
                detalhesContainer.style.display = "none";
            }
        });
    }
	
    // Botão "Limpar"
    document.getElementById("clearSearchButton").addEventListener("click", function () {
        searchInput.value = "";
        pesquisarMusicas();
    });
		
	// Botão "Deletar"
    const botaoDeletar = document.getElementsByClassName("deletar");
    for (let i = 0; i < botaoDeletar.length; i++) {
        botaoDeletar[i].addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            fetch(`/deletar_musica/${index}`, {
                method: "GET",
            })
                .then(response => response.text())
                .then(data => {
                    location.reload();
                })
                .catch(error => console.error("Erro ao deletar música: " + error));
        });
    }
	
	
	
	
	
	
	
	
	
	
	
	
});


