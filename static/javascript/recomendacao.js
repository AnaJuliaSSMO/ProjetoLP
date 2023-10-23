window.addEventListener('load', function () {
    const form = document.querySelector('#music-form');
    const mensagemElement = document.querySelector('.right-column p');
    const recommendationsList = document.querySelector('.right-column ul');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const artista = document.querySelector('#artista').value;
        const vibe = document.querySelector('#vibe').value;
        const genero = document.querySelector('#genero').value;
        const dancabilidade = document.querySelector('#dancabilidade').value;
        const bpm = document.querySelector('#bpm').value;
        const popularidade = document.querySelector('#popularidade').value;

        const formData = new URLSearchParams({
            artista: artista,
            vibe: vibe,
            genero: genero,
            dancabilidade: dancabilidade,
            bpm: bpm,
            popularidade: popularidade
        });

      fetch('/recomendar_musica', {
		method: 'POST',
		body: formData,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
			}
	  })

	.then(response => response.text())  
	.then(data => {
		const lines = data.split('\n');
		mensagemElement.textContent = lines[0];
		recommendationsList.innerHTML = '';

		for (let i = 1; i < lines.length; i++) {
			if (lines[i]) {  // Verifica se a linha não está vazia
				const listItem = document.createElement('li');
				listItem.textContent = lines[i];
				recommendationsList.appendChild(listItem);
			}
		}
	})
	
	.catch(error => {
		console.error('Erro na solicitação: ' + error);
	});

});	