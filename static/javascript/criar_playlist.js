document.addEventListener("DOMContentLoaded", function () {
    const musicForm = document.getElementById('music-form');
    const playlistDoDia = document.getElementById('playlist-do-dia');
    const adicionarButton = document.getElementById('adicionarButton');
    const removerButton = document.getElementById('removerButton');
    const limparButton = document.getElementById('limparButton');
    const clearSearchButton = document.getElementById('clearSearchButton');
    const listaMusicas = document.getElementById("listaMusicas");
    const musicasOriginais = Array.from(listaMusicas.getElementsByTagName("li"));


//------------------------------------------------------------FUNCOES---------------------------------------------------------------------

    // Função para adicionar músicas à playlist do lado direito
    function adicionarMusicaAPlaylist() {
        const selectedCheckboxes = musicForm.querySelectorAll('input[name="musicas_selecionadas"]:checked');
        selectedCheckboxes.forEach(function (checkbox) {
            const nomeMusicaArtista = checkbox.value;

            const li = document.createElement('li');
            const checkboxCopy = document.createElement('input');
            checkboxCopy.type = "checkbox";
            checkboxCopy.name = "musicas_playlist";
            checkboxCopy.value = nomeMusicaArtista;
            li.appendChild(checkboxCopy);
            li.appendChild(document.createTextNode(nomeMusicaArtista));

            playlistDoDia.appendChild(li);

            // DesmarCAR a caixa de seleção após adicionar à playlist
            checkbox.checked = false;
        });
    }

    // Função para remover músicas da Playlist do Dia
    function removerMusicaDaPlaylist() {
        const selectedCheckboxes = playlistDoDia.querySelectorAll('input[name="musicas_playlist"]:checked');
        selectedCheckboxes.forEach(function (checkbox) {
            const li = checkbox.closest('li');
            li.remove();
        });
    }

    // Função para limpar a Playlist do Dia
    function limparPlaylistDoDia() {
        playlistDoDia.innerHTML = '';
    }

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

    // Botão "Limpar"
    document.getElementById("clearSearchButton").addEventListener("click", function () {
        searchInput.value = "";
        pesquisarMusicas(); // Chama a função de pesquisa para restaurar a lista completa
    });
	

    // Campo de pesquisa
    searchInput.addEventListener("input", function() {
        pesquisarMusicas();
    });

	document.getElementById("saveButton").addEventListener("click", function() {
		const nome_playlist = document.getElementById("nome_playlist").value;

		// pEGAR as músicas da playlist
		const playlistItems = playlistDoDia.querySelectorAll('li');
		const playlistMusics = [];

		playlistItems.forEach(function (item) {
        const text = item.textContent.trim();
        const parts = text.split(" - ");
        if (parts.length === 2) {
            const musica = parts[0];
            const artista = parts[1];
            playlistMusics.push(`${musica}-${artista}`);
        }
    });



//------------------------------------------------------------MONTAR---------------------------------------------------------------------


    // Montar a lista de músicas da playlist
    const playlistData = playlistMusics.join(' / ');

    fetch('/salvar_playlist', {
        method: 'POST',
        body: JSON.stringify({ nome_playlist: nome_playlist, playlistData: playlistData }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // Playlist salva com sucesso
            alert('Playlist salva com sucesso!');
        } else {
            // Lidar com erros, se houver
            alert('Erro ao salvar a playlist.');
        }
    }).catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar a playlist.');
    });

    // Limpar o campo de entrada de texto após salvar a playlist
    document.getElementById("nome_playlist").value = '';

    // Limpar a Playlist do Dia
    limparPlaylistDoDia();
});


//-----------------------------------------------------------BOTOES---------------------------------------------------------------------



    // botão "Limpar" para reverter para a lista completa
    limparButton.addEventListener('click', function() {
        limparPlaylistDoDia();
    });

    // Botão "Adicionar" - Adiciona músicas selecionadas à Playlist do Dia
    adicionarButton.addEventListener('click', function() {
        adicionarMusicaAPlaylist();
    });

    // Botão "Remover" - Remove músicas selecionadas da Playlist do Dia
    removerButton.addEventListener('click', function() {
        removerMusicaDaPlaylist();
    });











});
