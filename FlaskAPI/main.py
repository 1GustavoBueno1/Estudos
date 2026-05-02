from flask import Flask, render_template, request, redirect, url_for
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
class Cursos(db.Model):
    def __init__(self, nome, desc, ch):
        self.nome = nome
        self.desc = desc
        self.ch = ch
    id = db.Column(db.Integer, primary_key = True, unique = True)
    nome = db.Column(db.String(50))
    desc = db.Column(db.String(150))
    ch = db.Column(db.Integer)
@app.route("/", methods = ['GET'])
def homepage():
    return render_template("homepage.html")

@app.route("/CursosDisponiveis", methods = ['GET'])
def ver_cursos():
    return render_template("cursos_disponiveis.html", cursos = Cursos.query.all())

@app.route("/CadastrarCurso", methods = ['GET', 'POST'])
def cadastrar_curso():
    if request.method == 'POST':
        nome = request.form.get("nome")
        desc = request.form.get("desc")
        ch = request.form.get("ch")
        curso = Cursos(nome, desc, ch)
        db.session.add(curso)
        db.session.commit()
        return redirect(url_for('cadastrar_curso'))
    return render_template("cadastro_de_cursos.html")

@app.route("/filmes/<propriedade>", methods = ['GET'])
def filmes(propriedade):
    if propriedade == 'populares':
        url = f'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key={API_KEY}'
    elif propriedade == 'infantil':
        url = f'https://api.themoviedb.org/3/discover/movie?with_genres=16&certification_country=US&certification.lte=PG&sort_by=popularity.desc&api_key={API_KEY}'
    elif propriedade == 'filmes_em_cartaz':
        url = f'https://api.themoviedb.org/3/movie/now_playing?api_key={API_KEY}'
    api_resposta = urllib.request.urlopen(url)
    dados_brutos = api_resposta.read()
    jsondata = json.loads(dados_brutos)
    return render_template("filmes.html", filmes = jsondata['results'])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug = True)
