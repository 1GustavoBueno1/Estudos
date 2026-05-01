from flask import Flask, render_template, request
import urllib.request, json
from dotenv import load_dotenv
import os
app = Flask(__name__)
app.json.sort_keys = False
load_dotenv()
API_KEY = os.getenv("api_key")


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
@app.route("/filmes_populares", methods = ['GET'])
def filmes_populares():
    url = f'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key={API_KEY}'
    api_reposta = urllib.request.urlopen(url)
    dados_brutos = api_reposta.read()
    jsondata = json.loads(dados_brutos)
    return render_template("filmes.html", filmes = jsondata['results'])
@app.route("/filmes_infantis", methods = ['GET'])
def filmes_infantis():
    url = f'https://api.themoviedb.org/3/discover/movie?with_genres=16&certification_country=US&certification.lte=PG&sort_by=popularity.desc&api_key={API_KEY}'
    api_resposta = urllib.request.urlopen(url)
    dados_brutos = api_resposta.read()
    jsondata = json.loads(dados_brutos)
    return render_template("filmes.html", filmes = jsondata['results'])
@app.route("/filmes_em_cartaz", methods = ['GET'])
def filmes_em_cartaz():
    url = f'https://api.themoviedb.org/3/movie/now_playing?api_key={API_KEY}'
    api_resposta = urllib.request.urlopen(url)
    dados_brutos = api_resposta.read()
    jsondata = json.loads(dados_brutos)
    return render_template("filmes.html", filmes = jsondata['results'])


#Aqui e onde eu "ativo" o site
if __name__ == '__main__':
    app.run(debug = True)