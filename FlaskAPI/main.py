from flask import Flask, make_response, jsonify, request
from json_py import load_cars, save_cars
app = Flask(__name__)
app.json.sort_keys = False
Carros = load_cars()


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

@app.route("/", methods = ['GET'])
def homepage():
    response = make_response(
        jsonify(mensage = 'Lista de carros cadastrados.',
                Dados = Carros)
    )
    return response



@app.route("/create-car", methods = ['POST'])
def create_car():
    Car = request.json
    Carros.append(Car)
    save_cars(Carros)
    return make_response(
        jsonify(
            mensage = 'Carro registrado com sucesso!',
            Data_car = Car
        )
    )


#Aqui e onde eu "ativo" o site
if __name__ == '__main__':
    app.run()