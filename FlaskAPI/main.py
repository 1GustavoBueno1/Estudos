from flask import Flask, render_template
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

@app.route("/", methods = ['GET'])
def homepage():
    fruta1 = 'Morango'
    fruta2 = 'Maça'
    fruta3 = 'Melancia'
    fruta4 = 'Banana'

    return render_template("Index.html", fruta1 = fruta1,
                                        fruta2 = fruta2,
                                        fruta3 = fruta3,
                                        fruta4 = fruta4)

@app.route("/page2", methods = ['GET'])
def pag2():
    return render_template("pag2.html")

#Aqui e onde eu "ativo" o site
if __name__ == '__main__':
    app.run()