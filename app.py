from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)

# Página inicial
@app.route('/')
def index():
    return render_template('index.html')
    



# Rota para registrar músicas, o user escolhe os campos e todas vão para o arquivo musicas.txt
@app.route('/registrar_musica', methods=['GET', 'POST'])
def registrar_musica():
    if request.method == 'POST':
        # Obtenha os dados do formulário
        nome = request.form.get('nome', '')
        artista = request.form.get('artista', '')
        vibe = request.form.get('vibe', '')
        genero = request.form.get('genero', '')
        dancabilidade = request.form.get('dancabilidade', '')
        bpm = request.form.get('bpm', '')
        popularidade = request.form.get('popularidade', '')

        if not nome or not artista or not vibe or not genero or not dancabilidade or not bpm or not popularidade:
            # Se algum campo obrigatório estiver vazio ele não deixa prosseguir
            mensagem = "Por favor, preencha todos os campos obrigatórios."
            return render_template('registrar_musica.html', mensagem=mensagem)

        nova_musica = f"{nome}:{artista}:{vibe}:{genero}:{dancabilidade}:{bpm}:{popularidade}\n"

        with open("musicas.txt", "a") as arquivo:
            arquivo.write(nova_musica)

        print(f"Nova música registrada: {nova_musica}")

    return render_template('registrar_musica.html')
       



# Carregar as músicas já registradas do arquivo musicas.txt
def carregar_musicas_registradas():
    musicas_registradas = []
    try:
        with open("musicas.txt", "r") as arquivo:
            for linha in arquivo:
                dados_musica = linha.strip().split(':')
                if len(dados_musica) == 7:  # Verifique se há 7 campos
                    nome = dados_musica[0]
                    artista = dados_musica[1]
                    vibe = dados_musica[2]
                    genero = dados_musica[3]
                    dancabilidade = dados_musica[4]
                    bpm = dados_musica[5]
                    popularidade = dados_musica[6]
                    musicas_registradas.append((nome, artista, vibe, genero, dancabilidade, bpm, popularidade))
    except FileNotFoundError:
        pass

    return musicas_registradas

musicas_registradas = carregar_musicas_registradas()




def atualizar_lista_musicas(): #precisei fazer esse por que somente as músicas que ja tinham carregadas antes do server ser iniciado apareciam
    global musicas_registradas
    musicas_registradas = carregar_musicas_registradas()




# Rota para listar músicas
@app.route('/lista_musicas', methods=['GET', 'POST'])
def lista_musicas():
    if request.method == 'POST':
        pesquisa = request.form.get('pesquisa', '').strip()
        musicas_filtradas = []

        for musica in musicas_registradas:
            nome_musica, artista_musica, _ = musica
            if pesquisa.lower() in nome_musica.lower() or pesquisa.lower() in artista_musica.lower():
                musicas_filtradas.append(musica)

        return render_template('lista_musicas.html', musicas=musicas_filtradas, pesquisa=pesquisa)

    atualizar_lista_musicas()  # Atualiza a lista de músicas
    return render_template('lista_musicas.html', musicas=musicas_registradas, pesquisa='')




# Rota para deletar uma música
@app.route('/deletar_musica/<int:index>', methods=['POST'])
def deletar_musica(index):
    if 0 <= index < len(musicas_registradas):
        # Remove a música da lista
        deleted_music = musicas_registradas.pop(index)

        # Atualiza o arquivo musicas.txt
        with open("musicas.txt", "w") as arquivo:
            for musica in musicas_registradas:
                arquivo.write(f"{':'.join(musica)}\n")

        return redirect(url_for('lista_musicas'))

    return "Índice inválido"




# Rota para criar uma playlist
@app.route('/criar_playlist', methods=['GET', 'POST'])
def criar_playlist():
    nome_playlist = 'Playlist Sem Nome'

    if request.method == 'POST':
        nome_playlist = request.form.get('nome_playlist', '')

        musicas_selecionadas = request.form.getlist('musicas_selecionadas')
        playlist_do_dia = [] 

        if nome_playlist:
            playlist_do_dia.insert(0, nome_playlist)

        for musica in musicas_selecionadas:
            playlist_do_dia.append(musica)

        playlist_data = ' / '.join(playlist_do_dia)

        return render_template('criar_playlist.html', musicas=musicas_registradas, playlist=playlist_do_dia, nome_playlist=nome_playlist)

    atualizar_lista_musicas()  # Carrega as músicas salvas
    return render_template('criar_playlist.html', musicas=musicas_registradas, playlist=[], nome_playlist=nome_playlist)




# Rota para salvar a playlist
@app.route('/salvar_playlist', methods=['POST'])
def salvar_playlist():
    playlist_data = request.get_json()
    nome_playlist = playlist_data.get('nome_playlist', 'Playlist Sem Nome')
    musicas_playlist = playlist_data.get('playlistData', '')

    if musicas_playlist:
        # Salvar os dados da playlist no arquivo playlist.txt em modo de anexação
        with open("playlist.txt", "a") as arquivo:
            arquivo.write(f"{nome_playlist}: {musicas_playlist}\n")

        # Limpar o campo de nome da playlist após salvar
        nome_playlist = ''

        return 'Playlist salva com sucesso!', 200

    return 'Erro ao salvar a playlist.', 400




# Rota para reconendar uma musica
@app.route('/recomendar_musica', methods=['GET', 'POST'])
def recomendar_musica():
    musicas_registradas = carregar_musicas_registradas()
    recomendacoes = []
    mensagem = ''

    if request.method == 'POST':
        artista = request.form.get('artista', '').strip()
        vibe = request.form.get('vibe', '').strip()
        genero = request.form.get('genero', '').strip()
        dancabilidade = request.form.get('dancabilidade', '').strip()
        bpm = request.form.get('bpm', '').strip()
        popularidade = request.form.get('popularidade', '').strip()

        for musica in musicas_registradas:
            _, artista_musica, vibe_musica, genero_musica, dancabilidade_musica, bpm_musica, popularidade_musica = musica

            if (not artista or artista.lower() in artista_musica.lower()) and \
               (not vibe or vibe == vibe_musica) and \
               (not genero or genero == genero_musica) and \
               (not dancabilidade or dancabilidade == dancabilidade_musica) and \
               (not bpm or bpm == bpm_musica) and \
               (not popularidade or popularidade == popularidade_musica):
                recomendacoes.append(f'{musica[0]} - {artista_musica}')

        if not musicas_registradas:
            mensagem = "Lista de músicas vazia, que tal registrar algumas?"
        else:
            mensagem = f"{len(recomendacoes)} música(s) recomendada(s) com base nos critérios."

    return render_template('recomendacao.html', recomendacoes=recomendacoes, mensagem=mensagem)




# Rota para carregar as playlists,
def carregar_playlists():
    playlists = {}
    try:
        with open("playlist.txt", "r") as arquivo:
            for linha in arquivo:
                partes = linha.strip().split(":")
                if len(partes) > 1:
                    nome_playlist = partes[0]
                    musicas = partes[1].split("/")
                    playlists[nome_playlist] = musicas
    except FileNotFoundError:
        pass

    return playlists




# Rota para mostrar as playlists
@app.route('/minhas_playlists')
def minhas_playlists():
    playlists = carregar_playlists()
    return render_template('minhas_playlists.html', playlists=playlists)




# Rota para esclui as playlists
@app.route('/excluir_playlist', methods=['POST'])
def excluir_playlist():
    playlist_name = request.form.get('playlist_name')
    playlists = carregar_playlists()

    if playlist_name in playlists:
        del playlists[playlist_name]

        # Atualiza o arquivo playlist.txt com as playlists restantes
        with open("playlist.txt", "w") as arquivo:
            for nome_playlist, musicas_da_playlist in playlists.items():
                arquivo.write(f"{nome_playlist}:{'/'.join(musicas_da_playlist)}\n")

        # Redireciona de volta à página de Minhas Playlists após a exclusão
        return redirect(url_for('minhas_playlists'))

    # Se a playlist não for encontrada, você pode lidar com isso da maneira que preferir, por exemplo, retornando uma página de erro.
    return "Playlist não encontrada"

  

if __name__ == '__main__':
    app.run(debug=True)

