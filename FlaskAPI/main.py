from flask import Flask, render_template, request
import urllib.request, json
app = Flask(__name__)
app.json.sort_keys = False
#apartir daqui eu dei inicio a outro curso, pois não achei mais videos
#do antigo criador

#Rotas
#Rotas são aonde acontece a criação de cada pagina do site

#Metodo GET, ele serve para buscar dados em algum banco de dados, listas e etc...
#ele indica ao decoretor para aceitar apenas buscas de dados, nao permitindo
#outras coisas como a inserção de dados

#Função make_response, serve para darmos uma reposta mais modificada ao cliente
#ele permite a personalização da resposta
#Função Jsonify, ele transforma toda list, dict em dados em formato json para
#se comunicar

#Metodo POST, usado para inserir algum valor a sua tabela
registros = []
frutas = ["banana", "maça", "Melancia"]
@app.route("/", methods = ['GET'])
def homepage():
    return render_template("homepage.html")
@app.route("/pagina1", methods = ['GET', 'POST'])
def pagina1():
    if request.method == "POST":
        if request.form.get("frutas"):
            frutas.append(request.form.get("frutas"))
    return render_template("Index.html", frutas = frutas)
@app.route("/pagina2", methods = ['GET', 'POST'])
def pagina2():
    if request.method == 'POST':
        if request.form.get("Aluno") and request.form.get("Nota"):
            registros.append({'Aluno': request.form.get("Aluno"), 'Nota': request.form.get("Nota")})
    return render_template("pag2.html", registros = registros)
@app.route("/filmes", methods = ['GET'])
def filmes():
    url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=b1fca6c44a64f9b3b62030634509a9bf'
    reposta = urllib.request.urlopen(url)
    dados = reposta.read()
    jsondata = json.loads(dados)
    return render_template("filmes.html", filmes = jsondata['results'])

#Aqui e onde eu "ativo" o site
if __name__ == '__main__':
    app.run(debug = True)