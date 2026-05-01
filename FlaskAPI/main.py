from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import urllib.request, json
from dotenv import load_dotenv
import os
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///cursos.sqlite3"
db = SQLAlchemy(app)
app.json.sort_keys = False
load_dotenv()
API_KEY = os.getenv("api_key")
class UsuariosDoCurso(db.Model):
    def __init__(self, nome, desc, ch):
        self.nome = nome
        self.desc = desc
        self.ch = ch
    id = db.Column(db.Integer, primary_key = True, unique = True)
    nome = db.Column(db.String(50))
    desc = db.Column(db.String(150))
    ch = db.Column(db.Integer)


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

@app.route("/filmes/<propriedade>", methods = ['GET'])
def filmes(propriedade):
    if propriedade == 'populares':
        url = f'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key={API_KEY}'
    elif propriedade == 'infantil':
        url = f'https://api.themoviedb.org/3/discover/movie?with_genres=16&certification_country=US&certification.lte=PG&sort_by=popularity.desc&api_key={API_KEY}'
    elif propriedade == 'filmes_em_cartaz':
        url = f'https://api.themoviedb.org/3/movie/now_playing?api_key={API_KEY}'
    api_reposta = urllib.request.urlopen(url)
    dados_brutos = api_reposta.read()
    jsondata = json.loads(dados_brutos)
    return render_template("filmes.html", filmes = jsondata['results'])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug = True)
