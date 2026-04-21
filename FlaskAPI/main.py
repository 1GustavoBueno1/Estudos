from flask import Flask, make_response, jsonify
from db import Carros
app = Flask(__name__)

#Rotas
#Rotas são aonde acontece a criação de cada pagina do site
#Metodo GET, ele serve para buscar dados em algum banco de dados, listas e etc...
#ele indica ao decoretor para aceitar apenas buscas de dados, nao permitindo
#outras coisas como a inserção de dados

#Função make_response, serve para darmos uma reposta mais modificada ao cliente
#ele permite a personalização da resposta
#Função Jsonify, ele transforma toda list, dict em dados em formato json para
#se comunicar

@app.route("/", methods = ['GET'])
def homepage():
    response = make_response(
        jsonify(Carros)
    )
    return response
#Aqui e onde eu "ativo" o site
if __name__ == '__main__':
    app.run()